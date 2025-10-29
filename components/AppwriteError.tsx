import React from 'react';

const AppwriteError: React.FC = () => {
  const hostname = window.location.hostname;
  const isFileOrNoHost = window.location.protocol === 'file:' || !hostname;

  const FileProtocolInstructions = () => (
    <>
      <p className="mb-6 text-gray-600">
        It looks like you're running this app in a way that prevents it from connecting to the support network (e.g., directly from a local file). It must be served from a web server.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-left border">
        <p className="font-bold text-lg mb-3">Action Required:</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            If you have Node.js installed, open a terminal in the project folder and run{' '}
            <code className="bg-gray-200 p-1 rounded">npx serve</code>. This will start a local web server.
          </li>
          <li>
            Go to your Appwrite project dashboard at{' '}
            <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              cloud.appwrite.io
            </a>.
          </li>
          <li>In your project, navigate to the <strong>Platforms</strong> section.</li>
          <li>
            Click <strong>Add Platform</strong> and choose <strong>Web App</strong>.
          </li>
          <li>
            For the hostname, you should enter what is used by your local server, which is typically:
            <div className="mt-2 p-3 bg-gray-200 text-gray-900 rounded font-mono break-all text-sm shadow-inner">
              localhost
            </div>
          </li>
        </ol>
      </div>
    </>
  );

  const HostnameInstructions = () => (
    <>
      <p className="mb-6 text-gray-600">
        This app can't connect to its support network. This is a security feature, and you need to authorize this app's web address in your Appwrite project settings.
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
            You must enter the app's hostname. Please copy and paste this exact value:
            <div className="mt-2 p-3 bg-gray-200 text-gray-900 rounded font-mono break-all text-sm shadow-inner">
              {hostname}
            </div>
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
        
        {isFileOrNoHost ? <FileProtocolInstructions /> : <HostnameInstructions />}

        <p className="mt-6 text-gray-600">
          Once you have added the hostname in Appwrite, click the button below to try connecting again.
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