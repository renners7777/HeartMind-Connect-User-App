import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/audioUtils';
import { getApiKey } from '../services/apiKeyService';

interface VoiceInputProps {
  onCommand: (command: string) => void;
  apiKey: string | null;
}

// Keyframes for the pulse animation
const pulse = keyframes`
  50% {
    opacity: .5;
  }
`;

const VoiceInputContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
`;

const ListenButton = styled.button<{ isListening: boolean; disabled: boolean }>`
  position: relative;
  border-radius: 9999px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  ${({ isListening, disabled }) => {
    if (disabled) {
      return `
        width: 4rem;
        height: 4rem;
        background-color: #9ca3af; // gray-400
        cursor: not-allowed;
      `;
    }
    if (isListening) {
      return `
        width: 5rem; // w-20
        height: 5rem; // h-20
        background-color: #ef4444; // red-500
        animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        &:hover {
          background-color: #dc2626; // red-600
        }
      `;
    }
    return `
      width: 4rem; // w-16
      height: 4rem; // h-16
      background-color: #2563eb; // blue-600
      &:hover {
        background-color: #1d4ed8; // blue-700
      }
    `;
  }}
`;

const MicIcon = styled.svg`
  height: 2rem; // h-8
  width: 2rem; // w-8
  color: white;
`;

const VoiceInput: React.FC<VoiceInputProps> = ({ onCommand, apiKey }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Tap to Speak');
  const sessionRef = useRef<any | null>(null); // FIX: Using any to avoid build error
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptionRef = useRef('');

  const audioQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  useEffect(() => {
    if (!apiKey) {
      setStatus('API Key needed');
    } else {
      setStatus('Tap to Speak');
    }
  }, [apiKey]);


  const stopListening = useCallback((sendCommand = true) => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    
    audioQueueRef.current.forEach(source => source.stop());
    audioQueueRef.current.clear();


    setIsListening(false);
    setStatus(apiKey ? 'Tap to Speak' : 'API Key needed');
    if (sendCommand && transcriptionRef.current.trim()) {
      onCommand(transcriptionRef.current.trim());
    }
    transcriptionRef.current = '';
    nextStartTimeRef.current = 0;
  }, [onCommand, apiKey]);

  const startListening = async () => {
    const currentApiKey = getApiKey();
    if (!currentApiKey) {
        console.error("Cannot start voice input without an API key.");
        setStatus("API Key required");
        return;
    }

    if (isListening) {
      stopListening(true);
      return;
    }

    try {
      setIsListening(true);
      setStatus('Connecting...');
      
      const ai = new GoogleGenAI({ apiKey: currentApiKey });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });


      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-1.5-flash-latest',
        callbacks: {
          onopen: () => {
            setStatus('Listening...');
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob: Blob = {
                data: encode(new Int16Array(inputData.map(f => f * 32768)).buffer),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((session) => {
                if(session) session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              transcriptionRef.current += message.serverContent.inputTranscription.text;
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
                const decodedAudio = decode(audioData);
                const audioBuffer = await decodeAudioData(decodedAudio, outputAudioContextRef.current, 24000, 1);

                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContextRef.current.destination);

                const currentTime = outputAudioContextRef.current.currentTime;
                const startTime = Math.max(currentTime, nextStartTimeRef.current);
                
                source.start(startTime);
                nextStartTimeRef.current = startTime + audioBuffer.duration;
                
                audioQueueRef.current.add(source);
                source.onended = () => {
                    audioQueueRef.current.delete(source);
                }
            }
             if (message.serverContent?.interrupted) {
                audioQueueRef.current.forEach(source => source.stop());
                audioQueueRef.current.clear();
                nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.turnComplete) {
              stopListening(true);
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Gemini Live API Error:', e);
            setStatus('Error');
            stopListening(false);
          },
          onclose: () => {
             // Already handled by stopListening
          },
        },
        config: {
          responseModalities: [Modality.AUDIO], 
          inputAudioTranscription: {},
          systemInstruction: `You are a friendly AI assistant for a stroke survivor. 
          Your role is to help them manage tasks, send messages, and navigate the app. 
          When they add a task or send a message, confirm the action clearly. For example, if they say 'add task call the doctor', you should respond 'Okay, I've added "call the doctor" to your tasks.'
          When they ask to navigate, confirm the navigation. For example, if they say 'go to chat', respond 'Going to the chat screen.'
          Keep responses concise, clear, and reassuring.`,
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (error) {
      console.error('Failed to start listening:', error);
      setStatus('Mic permission needed');
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      stopListening(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const isButtonDisabled = !apiKey;

  return (
    <VoiceInputContainer>
      <ListenButton
        onClick={startListening}
        disabled={isButtonDisabled}
        isListening={isListening}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <MicIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </MicIcon>
      </ListenButton>
    </VoiceInputContainer>
  );
};

export default VoiceInput;
