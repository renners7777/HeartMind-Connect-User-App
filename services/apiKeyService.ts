// services/apiKeyService.ts

// This variable will hold the key in memory after it's been retrieved.
let apiKey: string | null = null;
// We use a flag to ensure we only check the environment variable once.
let initialized = false;

/**
 * Initializes the API key for the application session.
 * It retrieves the key from process.env.API_KEY once and stores it.
 * The key's availability is handled externally as a hard requirement.
 * @returns The API key string or null.
 */
export function initializeApiKey(): string | null {
  if (!initialized) {
    // The API key MUST be obtained exclusively from the environment variable.
    apiKey = (process.env && process.env.API_KEY) || null;
    if (!apiKey) {
      console.error("Gemini API Key not found. Please set the API_KEY environment variable.");
    }
    initialized = true;
  }
  return apiKey;
}

/**
 * Gets the already initialized API key.
 * This is a convenience function to avoid re-initializing.
 * @returns The API key string or null.
 */
export function getApiKey(): string | null {
  if (!initialized) {
    // Ensure initialization happens if this is called first.
    return initializeApiKey();
  }
  return apiKey;
}
