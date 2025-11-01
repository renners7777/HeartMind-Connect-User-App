import React, { useState } from 'react';
import { account, databases, ID, USER_RELATIONSHIPS_COLLECTION_ID, DATABASE_ID } from '../services/appwrite';
import { AppwriteException, Permission } from 'appwrite';

interface LoginProps {
  onLoginSuccess: () => void;
}

const generateShareCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // O and 0 removed to avoid confusion
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};


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
      const newUser = await account.create(ID.unique(), email, password, name);

      // Update preferences with role and default values
      await account.updatePrefs({
        role: role,
        canCompanionAddTask: false,
      });
      
      // Only create a relationship document and shareable code for survivors
      if (role === 'survivor') {
        const newShareCode = generateShareCode();
        const userPermissions = [
            Permission.update(`user:${newUser.$id}`),
            Permission.delete(`user:${newUser.$id}`),
        ];
        // Let any guest user read this document to find the user by shareable_id
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

      await account.createEmailPasswordSession(email, password);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">HeartMind Connect</h1>
          <p className="mt-2 text-gray-600">
            {isLoginView ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
          </p>
        </div>
        <form className="space-y-6" onSubmit={isLoginView ? handleLogin : handleRegister}>
          {!isLoginView && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                    I am a...
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => setRole('survivor')}
                        className={`flex-1 px-4 py-2 text-sm font-medium border rounded-l-md transition-colors ${
                            role === 'survivor'
                            ? 'bg-blue-600 text-white border-blue-600 z-10 ring-1 ring-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Stroke Survivor
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('caregiver')}
                        className={`flex-1 -ml-px px-4 py-2 text-sm font-medium border rounded-r-md transition-colors ${
                            role === 'caregiver'
                            ? 'bg-blue-600 text-white border-blue-600 z-10 ring-1 ring-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Companion / Caregiver
                    </button>
                </div>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Register')}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm text-blue-600 hover:underline">
            {isLoginView ? 'Need an account? Register' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;