
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Models } from 'appwrite';
import styled from 'styled-components';
import type { UserPrefs } from '../types';
import { Page as PageEnum } from '../types';

interface HomeProps {
    user: Models.User<UserPrefs> | null;
    shareableCode: string | null;
    onLinkAccount: (shareableId: string) => Promise<void>;
}

const Home: React.FC<HomeProps> = ({ user, shareableCode, onLinkAccount }) => {
  const [copied, setCopied] = useState(false);
  const [linkingCode, setLinkingCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkingError, setLinkingError] = useState('');

  const caregiverName = user?.prefs.caregiver_name;
  const survivorName = user?.prefs.survivor_name;
  const isSurvivor = user?.prefs?.role === 'survivor';
  const isCaregiver = user?.prefs?.role === 'caregiver';

  const handleCopyToClipboard = () => {
    if (shareableCode) {
        navigator.clipboard.writeText(shareableCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingCode.trim()) {
        setLinkingError('Please enter a code.');
        return;
    }
    setIsLinking(true);
    setLinkingError('');
    try {
        await onLinkAccount(linkingCode.trim().toUpperCase());
        // On success, App.tsx will refresh data and this component will re-render
    } catch (error: any) {
        setLinkingError(error.message || 'Failed to link account. Please check the code and try again.');
    } finally {
        setIsLinking(false);
    }
  };

  return (
    <Container>
      <WelcomeBanner>
        <WelcomeTitle>Welcome Back, {user?.name}!</WelcomeTitle>
        <WelcomeText>
          We're here to support you. What would you like to do today?
        </WelcomeText>
      </WelcomeBanner>

      {/* For Survivors */}
      {isSurvivor && (
        caregiverName ? (
            <LinkedBanner>
                <p>
                    You are linked with your companion, <strong>{caregiverName}</strong>.
                </p>
            </LinkedBanner>
        ) : (
            <ShareContainer>
                <ShareTitle>Link with a Companion</ShareTitle>
                <ShareText>Share this code with your companion. They can use it in their app to connect with you.</ShareText>
                {shareableCode ? (
                    <ShareCodeContainer>
                        <ShareCode>
                            {shareableCode}
                        </ShareCode>
                        <CopyButton onClick={handleCopyToClipboard} aria-label="Copy code to clipboard">
                            {copied ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <span>Copy</span>
                                </>
                            )}
                        </CopyButton>
                    </ShareCodeContainer>
                ) : (
                    <LoadingContainer>
                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-blue-600 mx-auto"></div>
                        <p className="mt-2">Loading your code...</p>
                    </LoadingContainer>
                )}
            </ShareContainer>
        )
      )}

      {/* For Caregivers */}
      {isCaregiver && (
        survivorName ? (
            <LinkedBanner>
                <p>
                    You are linked with <strong>{survivorName}</strong>. You can now manage their tasks and chat with them.
                </p>
            </LinkedBanner>
        ) : (
            <LinkFormContainer>
                <ShareTitle>Link with a Survivor</ShareTitle>
                <ShareText>Enter the 6-digit code provided by the person you are caring for to link your accounts.</ShareText>
                <LinkForm onSubmit={handleLinkSubmit}>
                    <LinkInput
                        type="text"
                        value={linkingCode}
                        onChange={(e) => setLinkingCode(e.target.value)}
                        placeholder="ENTER CODE"
                        maxLength={6}
                        disabled={isLinking}
                    />
                    {linkingError && <LinkErrorText>{linkingError}</LinkErrorText>}
                    <LinkButton type="submit" disabled={isLinking}>
                        {isLinking ? 'Linking...' : 'Link Account'}
                    </LinkButton>
                </LinkForm>
            </LinkFormContainer>
        )
      )}

      <Grid>
        <HomeCard
            title="Daily Tasks"
            description="View and manage your daily tasks."
            icon={<TasksIcon />}
            to={PageEnum.Tasks}
        />
        <HomeCard
            title="Chat with Companion"
            description="Send a message to your support companion."
            icon={<ChatIcon />}
            to={PageEnum.Chat}
        />
        <HomeCard
            title="Track Progress"
            description="See how you're doing over time."
            icon={<ProgressIcon />}
            to={PageEnum.Progress}
        />
        <HomeCard
            title="Journal"
            description="Write down your thoughts and feelings."
            icon={<JournalIcon />}
            to={PageEnum.Journal}
        />
        <HomeCard
            title="Memory Game"
            description="A fun exercise to train your memory."
            icon={<GameIcon />}
            to={PageEnum.MemoryGame}
        />
        <HomeCard
            title="Companion App"
            description="Visit the companion website for resources."
            icon={<LinkIcon />}
            to="https://stroke-memory-app-companion-site.appwrite.network/"
        />
        <HomeCard
          title="Testing Panel"
          description="Simulate companion actions for testing."
          icon={<TestIcon />}
          to={PageEnum.Testing}
        />
      </Grid>
    </Container>
  );
};

interface HomeCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    to: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, description, icon, to }) => {
    const isExternal = to.startsWith('http');
    const cardContent = (
        <CardContainer>
            <IconContainer>{icon}</IconContainer>
            <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
        </CardContainer>
    );

    if (isExternal) {
        return (
            <a href={to} target="_blank" rel="noopener noreferrer">
                {cardContent}
            </a>
        );
    }

    return (
        <Link to={to}>
            {cardContent}
        </Link>
    );
};

const Container = styled.div`
    padding: 1.5rem;
`;

const WelcomeBanner = styled.div`
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    text-align: center;
    margin-bottom: 1.5rem;
`;

const WelcomeTitle = styled.h2`
    font-size: 1.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
    color: #4b5563;
`;

const LinkedBanner = styled.div`
    padding: 1.5rem;
    background-color: #f0fdf4; // green-50
    border: 1px solid #bbf7d0; // green-200
    border-radius: 0.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
    color: #166534; // green-800
    font-weight: 500;
`;

const ShareContainer = styled.div`
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-bottom: 1.5rem;
`;

const ShareTitle = styled.h3`
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
`;

const ShareText = styled.p`
    color: #4b5563;
    margin-bottom: 1rem;
`;

const ShareCodeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
`;

const ShareCode = styled.p`
    flex-grow: 1;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #1d4ed8;
    font-family: monospace;
    text-align: center;
`;

const CopyButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #2563eb;
    color: #ffffff;
    font-weight: 600;
    border-radius: 0.375rem;
    &:hover {
        background-color: #1d4ed8;
    }
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const LoadingContainer = styled.div`
    text-align: center;
    color: #6b7280;
    padding: 1rem;
`;

const LinkFormContainer = styled.div`
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-bottom: 1.5rem;
`;

const LinkForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const LinkInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: monospace;
  text-transform: uppercase;
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: 0.2em;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #3b82f6;
  }
`;

const LinkButton = styled.button`
    padding: 0.75rem 1rem;
    background-color: #16a34a;
    color: #ffffff;
    font-weight: 600;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    
    &:hover {
        background-color: #15803d;
    }
    &:disabled {
        background-color: #86efac;
        cursor: not-allowed;
    }
`;

const LinkErrorText = styled.p`
    color: #dc2626;
    font-size: 0.875rem;
    text-align: center;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const CardContainer = styled.div`
    background-color: #ffffff;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: background-color 0.2s;
    text-align: left;
    width: 100%;

    &:hover {
        background-color: #eff6ff;
    }
`;

const IconContainer = styled.div`
    color: #2563eb;
`;

const CardTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
`;

const CardDescription = styled.p`
    color: #4b5563;
    margin-top: 0.25rem;
`;

const SvgIcon = styled.svg`
    height: 2rem;
    width: 2rem;
`;

const TasksIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </SvgIcon>
);

const ChatIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </SvgIcon>
);

const ProgressIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </SvgIcon>
);

const JournalIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </SvgIcon>
);

const GameIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </SvgIcon>
);

const LinkIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </SvgIcon>
);

const TestIcon = () => (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </SvgIcon>
);


export default Home;
