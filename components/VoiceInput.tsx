import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/audioUtils';

interface VoiceInputProps {
  onCommand: (command: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Tap to Speak');
  const sessionRef = useRef<LiveSession | null>(null);
  
  // Audio contexts for input (mic) and output (speaker)
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptionRef = useRef('');

  // For playing back AI audio response
  const audioQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);


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
     // Don't close the output context, as audio might still be playing
    
    // Stop any currently playing audio from the AI
    audioQueueRef.current.forEach(source => source.stop());
    audioQueueRef.current.clear();


    setIsListening(false);
    setStatus('Tap to Speak');
    if (sendCommand && transcriptionRef.current.trim()) {
      onCommand(transcriptionRef.current.trim());
    }
    transcriptionRef.current = '';
    nextStartTimeRef.current = 0;
  }, [onCommand]);

  const startListening = async () => {
    if (isListening) {
      stopListening(true);
      return;
    }

    try {
      setIsListening(true);
      setStatus('Connecting...');
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });


      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
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

            // Handle audio response from the model
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

  return (
    <div className="sticky bottom-0 bg-white p-4 border-t-2 border-blue-200 flex flex-col items-center justify-center">
      <button
        onClick={startListening}
        className={`relative rounded-full transition-all duration-300 ease-in-out flex items-center justify-center
          ${isListening ? 'w-20 h-20 bg-red-500 hover:bg-red-600 animate-pulse' : 'w-16 h-16 bg-blue-600 hover:bg-blue-700'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      <p className="text-gray-600 mt-2 text-sm font-medium">{status}</p>
    </div>
  );
};

export default VoiceInput;