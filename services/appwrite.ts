import { Client, Account, Databases, ID } from 'appwrite';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
// Project and Database IDs from the public companion app repository
const APPWRITE_PROJECT_ID = '6645032900259b314502';
export const DATABASE_ID = '6645035f002d6b0a7008';
export const TASKS_COLLECTION_ID = '6645037d00288860a92a';
export const MESSAGES_COLLECTION_ID = '664503b40010a3003058';

export const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

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
