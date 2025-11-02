import React, { useState } from 'react';
import styled from 'styled-components';
import { account, databases, ID, USER_RELATIONSHIPS_COLLECTION_ID, DATABASE_ID } from '../services/appwrite';
import { AppwriteException, Permission } from 'appwrite';

interface LoginProps {
  onLoginSuccess: () => void;
}

const generateShareCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  & > * + * {
    margin-top: 1.5rem;
  }
`;

const Header = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  color: #4b5563;
`;

const Form = styled.form`
  & > * + * {
    margin-top: 1.5rem;
  }
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-top: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const RoleSelectorContainer = styled.div`
    margin-top: 0.5rem;
    display: flex;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const RoleButton = styled.button<{ isActive: boolean }>`
    flex: 1 1 0%;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid;
    transition: background-color 0.2s, color 0.2s;
    ${({ isActive }) =>
      isActive
        ? `
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
        z-index: 10;
        `
        : `
        background-color: white;
        color: #374151;
        border-color: #d1d5db;
        &:hover {
            background-color: #f9fafb;
        }
    `}
    
    &:first-child {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
    }

    &:last-child {
        margin-left: -1px;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: #dc2626;
  text-align: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background-color: #2563eb;
  border-radius: 0.375rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #60a5fa;
  }

  &:disabled {
    background-color: #93c5fd;
  }
`;

const ToggleViewButton = styled.button`
  font-size: 0.875rem;
  color: #2563eb;
  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'survivor' | 'caregiver'>('survivor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      onLoginSuccess();
    } catch (e) {
      if (e instanceof AppwriteException) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // 1. Create the user account
      const newUser = await account.create(ID.unique(), email, password, name);

      // 2. Immediately create a session to log the new user in
      await account.createEmailPasswordSession(email, password);

      // 3. Now that the user is logged in, update their preferences
      await account.updatePrefs({
        role: role,
        canCompanionAddTask: false,
      });
      
      // 4. If they are a survivor, create the relationship document
      if (role === 'survivor') {
        const newShareCode = generateShareCode();
        const userPermissions = [
            Permission.update(`user:${newUser.$id}`),
            Permission.delete(`user:${newUser.$id}`),
        ];
        // Let any guest user read this doc to find the user by shareable_id for linking
        const readPermissions = [Permission.read('role:all')];

        await databases.createDocument(
            DATABASE_ID,
            USER_RELATIONSHIPS_COLLECTION_ID,
            ID.unique(),
            { 
              shareable_id: newShareCode, 
              survivor_id: newUser.$id,
              survivor_name: newUser.name 
            },
            [...readPermissions, ...userPermissions]
        );
      }

      // 5. Signal to the main app that login was successful
      onLoginSuccess();

    } catch (e) {
        if (e instanceof AppwriteException) {
            setError(e.message);
          } else {
            setError('An unexpected error occurred during registration.');
          }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Header>
          <Title>HeartMind Connect</Title>
          <Subtitle>
            {isLoginView ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
          </Subtitle>
        </Header>
        <Form onSubmit={isLoginView ? handleLogin : handleRegister}>
          {!isLoginView && (
            <>
              <div>
                <InputLabel htmlFor="name">
                  Name
                </InputLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <InputLabel>
                    I am a...
                </InputLabel>
                <RoleSelectorContainer>
                    <RoleButton
                        type="button"
                        onClick={() => setRole('survivor')}
                        isActive={role === 'survivor'}
                    >
                        Stroke Survivor
                    </RoleButton>
                    <RoleButton
                        type="button"
                        onClick={() => setRole('caregiver')}
                        isActive={role === 'caregiver'}
                    >
                        Companion / Caregiver
                    </RoleButton>
                </RoleSelectorContainer>
              </div>
            </>
          )}
          <div>
            <InputLabel htmlFor="email">
              Email address
            </InputLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <InputLabel htmlFor="password">
              Password
            </InputLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <div>
            <SubmitButton
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Register')}
            </SubmitButton>
          </div>
        </Form>
        <div style={{textAlign: 'center'}}>
          <ToggleViewButton onClick={() => { setIsLoginView(!isLoginView); setError(''); }}>
            {isLoginView ? 'Need an account? Register' : 'Already have an account? Sign In'}
          </ToggleViewButton>
        </div>
      </LoginBox>
    </Container>
  );
};

export default Login;
