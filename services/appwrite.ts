import { Client, Account, Databases, ID, Models } from 'appwrite';
// Import the configuration from the new file
import { 
    APPWRITE_PROJECT_ID, 
    DATABASE_ID, 
    TASKS_COLLECTION_ID, 
    MESSAGES_COLLECTION_ID,
    USER_RELATIONSHIPS_COLLECTION_ID,
    JOURNAL_TABLE_COLLECTION_ID
} from './appwriteConfig';
import type { UserPrefs } from '../types';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';

export const client = new Client();

if (APPWRITE_PROJECT_ID) {
    client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
}


export const account = new Account(client);
export const databases = new Databases(client);

/**
 * Checks for an existing user session.
 * @returns The session object if the user is logged in, otherwise null.
 */
// FIX: Replaced deprecated `Models.Account` with `Models.User` for Appwrite user type.
// FIX: Used strongly-typed UserPrefs for Appwrite user object.
export const getSession = async (): Promise<Models.User<UserPrefs> | null> => {
    try {
        return await account.get();
    } catch {
        // No session found
        return null;
    }
};

/**
 * Deletes the current user session.
 */
export const logoutUser = async () => {
    await account.deleteSession('current');
}

export { ID };

// Re-export IDs for a single point of import elsewhere in the app.
export { DATABASE_ID, TASKS_COLLECTION_ID, MESSAGES_COLLECTION_ID, USER_RELATIONSHIPS_COLLECTION_ID, JOURNAL_TABLE_COLLECTION_ID };