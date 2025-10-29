// services/appwriteConfig.ts

// =====================================================================
// **ACTION REQUIRED**: PLEASE CONFIGURE YOUR APPWRITE PROJECT
// =====================================================================
// To run this application, you need to set up your own Appwrite project.
//
// Follow these steps:
//
// 1. **Create a Project**:
//    - Go to https://cloud.appwrite.io and create a new project.
//
// 2. **Fill in Project ID**:
//    - In your project's dashboard, copy the "Project ID" and paste it below.
//
// 3. **Create a Database**:
//    - Go to the "Databases" section, create a new database (e.g., name it "HeartMindDB").
//    - Copy the "Database ID" and paste it below.
//
// 4. **Create Collections and Attributes**:
//    - Inside your new database, create the required Collections.
//
//    - **Tasks Collection**:
//      - Create a collection named `reminders_table`. Copy its "Collection ID" below.
//      - Attributes: `text` (string, 255, required), `completed` (boolean, required, default: false), `creator_name` (string, 255, optional).
//
//    - **Messages Collection**:
//      - Create a collection named `messages_table`. Copy its "Collection ID" below.
//      - Attributes: `text` (string, 1024, required), `sender` (string, 50, required).
//
//    - **Journal Entries Collection**:
//      - Create a collection named `journal_table`. Copy its "Collection ID" below.
//      - Attributes: `content` (string, 10000, required), `shared_with_companion` (boolean, required, default: false).
//
//    - **User Relationships Collection (NEW)**:
//      - Create a collection named `user_relationships_table`. Copy its "Collection ID" below.
//      - This is the central table for linking survivors and companions.
//      - Attributes:
//        - `survivor_id`: type `string`, size `255`, `required`.
//        - `survivor_name`: type `string`, size `255`, `required`.
//        - `companion_id`: type `string`, size `255`, `optional`.
//        - `companion_name`: type `string`, size `255`, `optional`.
//        - `shareable_id`: type `string`, size `50`, `required`. **Important**: Go to the "Indexes" tab and create a unique index on this attribute.
//
// 5. **Configure Permissions**:
//    - **For the `user_relationships_table` collection:**
//      - Go to its "Settings" -> "Permissions".
//      - Add role "Users" (Authenticated Users) and grant them READ access. This is crucial so the companion app can look up the shareable code.
//
//    - **For `reminders_table`, `messages_table`, and `journal_table`:**
//      - No collection-level permissions are needed here, as document-level permissions are handled by the app code.
//
// 6. **Add Web Platform**:
//    - Go to your project dashboard's main page.
//    - Click "Add Platform" and choose "Web App".
//    - For "Hostname", enter `localhost` (for local development).
//
// 7. **Save and Refresh**:
//    - Save this file with your new IDs, then refresh the application.
// =====================================================================


export const APPWRITE_PROJECT_ID = '68b201d3001d7dbcec43';
export const DATABASE_ID = '68b213e7001400dc7f21';
export const TASKS_COLLECTION_ID = 'reminders_table';
export const MESSAGES_COLLECTION_ID = 'messages_table';
export const USER_RELATIONSHIPS_COLLECTION_ID = 'user_relationships_table';
export const JOURNAL_TABLE_COLLECTION_ID = 'journal_table';

/**
 * A simple check to see if the user has updated the configuration placeholders.
 * @returns {boolean} True if the project appears to be configured.
 */
export const isAppwriteConfigured = () => {
    // Check if the configuration values are filled, rather than comparing to specific placeholders.
    // This is more robust and prevents errors if a valid project uses similar IDs.
    return APPWRITE_PROJECT_ID.length > 0 &&
           DATABASE_ID.length > 0 &&
           TASKS_COLLECTION_ID.length > 0 &&
           MESSAGES_COLLECTION_ID.length > 0 &&
           JOURNAL_TABLE_COLLECTION_ID.length > 0;
};