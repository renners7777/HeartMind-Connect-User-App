import React from 'react';
import { isAppwriteConfigured } from '../services/appwriteConfig';

const AppwriteError: React.FC = () => {
  const configured = isAppwriteConfigured();

  const ConfigurationInstructions = () => (
    <>
      <p className="mb-6 text-gray-600">
        This usually means the Appwrite project has not been configured correctly. To get the app running, you need to set up a free backend for it.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-left border">
        <p className="font-bold text-lg mb-3">Action Required:</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            In your code editor, open the file:
            <div className="mt-2 p-3 bg-gray-200 text-gray-900 rounded font-mono break-all text-sm shadow-inner">
              services/appwriteConfig.ts
            </div>
          </li>
          <li>
            Follow the detailed instructions written in the comments of that file to create and configure your Appwrite project.
          </li>
          <li>
            Once you have filled in your project details and saved the file, click the button below.
          </li>
        </ol>
      </div>
    </>
  );

  const CorsInstructions = () => (
    <>
      <p className="mb-6 text-gray-600">
        The app is configured, but it still can't connect. This is likely a security (CORS) issue. You need to authorize this app's web address in your Appwrite project settings.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-left border">
        <p className="font-bold text-lg mb-3">Action Required:</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            Go to your Appwrite project dashboard at{' '}
            <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              cloud.appwrite.io
            </a>.
          </li>
          <li>In your project, go to the <strong className="text-gray-900">Platforms</strong> section.</li>
          <li>
            Click <strong className="text-gray-900">Add Platform</strong> and select <strong className="text-gray-900">Web App</strong>.
          </li>
          <li>
            For the "Hostname", enter <strong className="text-gray-900">localhost</strong>.
          </li>
        </ol>
      </div>
    </>
  );

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white border-2 border-red-200 text-gray-800 p-8 rounded-xl shadow-xl max-w-2xl text-center">
        <div className="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-3">Connection Problem</h2>
        
        {!configured ? <ConfigurationInstructions /> : <CorsInstructions />}

        <p className="mt-6 text-gray-600">
          After completing the steps, click the button below to try connecting again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md text-lg"
        >
          Refresh and Reconnect
        </button>
      </div>
    </div>
  );
};

export default AppwriteError;
