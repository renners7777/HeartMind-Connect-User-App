import { Client, Account, Databases, ID } from 'appwrite';
// Import the configuration from the new file
import { 
    APPWRITE_PROJECT_ID, 
    DATABASE_ID, 
    TASKS_COLLECTION_ID, 
    MESSAGES_COLLECTION_ID 
} from './appwriteConfig';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';

export const client = new Client();

// Only set project if it's configured to avoid Appwrite SDK errors on initial load
if (APPWRITE_PROJECT_ID && APPWRITE_PROJECT_ID !== 'PASTE_YOUR_PROJECT_ID_HERE') {
    client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
}


export const account = new Account(client);
export const databases = new Databases(client);

/**
 * Ensures the user has a session. Creates an anonymous session if one doesn't exist.
 * This is suitable for the user-facing app for ease of access.
 */
export const getSession = async () => {
    try {
        return await account.get();
    } catch {
        // Not logged in, create an anonymous session
        await account.createAnonymousSession();
        return await account.get();
    }
};

export { ID };

// Re-export IDs for a single point of import elsewhere in the app.
export { DATABASE_ID, TASKS_COLLECTION_ID, MESSAGES_COLLECTION_ID };
