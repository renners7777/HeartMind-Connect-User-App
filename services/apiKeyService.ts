// services/apiKeyService.ts

// This variable will hold the key in memory after it's been retrieved once.
let apiKey: string | null = null;
const API_KEY_STORAGE_KEY = 'gemini_api_key';

/**
 * Retrieves the Google AI API key.
 * It follows a specific order:
 * 1. Check for an environment variable (process.env.API_KEY).
 * 2. Check for a key saved in the browser's local storage.
 * 3. If not found, prompt the user to enter their key.
 * @returns The API key string, or null if not found or provided.
 */
function retrieveApiKey(): string | null {
  // 1. Check environment variables (for deployed environments)
  if (process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }

  // 2. Check local storage
  try {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      return storedKey;
    }
  } catch (error) {
    console.error("Could not access localStorage:", error);
  }

  // 3. Prompt the user as a last resort
  try {
    const userProvidedKey = window.prompt(
      "Please enter your Google AI API Key for voice features:"
    );
    if (userProvidedKey) {
      // Save it to local storage for future sessions
      localStorage.setItem(API_KEY_STORAGE_KEY, userProvidedKey);
      return userProvidedKey;
    }
  } catch (error) {
    console.error("Could not display prompt:", error);
  }

  return null;
}

/**
 * Initializes the API key for the application session.
 * It calls retrieveApiKey() once and stores the result in memory.
 * @returns The API key string or null.
 */
export function initializeApiKey(): string | null {
  if (!apiKey) {
    apiKey = retrieveApiKey();
  }
  return apiKey;
}

/**
 * Gets the already initialized API key.
 * @returns The API key string or null.
 */
export function getApiKey(): string | null {
    return apiKey;
}
