// services/appwriteConfig.ts

// =====================================================================
// **ACTION REQUIRED**: PLEASE CONFIGURE YOUR APPWRITE PROJECT
// =====================================================================
// To run this application, you need to set up your own Appwrite project,
// as the public one is for demonstration purposes only.
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
//    - Inside your new database, create the required Collections. After creating each, go to its "Attributes" tab to add fields.
//
//    - **Tasks Collection**:
//      - Create a collection named `reminders_table`. Copy its "Collection ID" below.
//      - Add attributes:
//        - `text`: type `string`, size `255`, `required`
//        - `completed`: type `boolean`, `required`, default value `false`
//        - `creator_name`: type `string`, size `255`, `optional`
//
//    - **Messages Collection**:
//      - Create a collection named `messages_table`. Copy its "Collection ID" below.
//      - Add attributes:
//        - `text`: type `string`, size `1024`, `required`
//        - `sender`: type `string`, size `50`, `required`
//
//    - **Journal Entries Collection (New)**:
//      - Create a collection named `journal_table`. Copy its "Collection ID" below.
//      - Add attributes:
//        - `content`: type `string`, size `10000`, `required`
//        - `shared_with_companion`: type `boolean`, `required`, default `false`
//
//    - **Shares Collection**:
//      - Create a collection named `shares_table`. Copy its "Collection ID" below.
//      - This collection is used by the companion app to make their shareable ID discoverable.
//      - Add attributes:
//        - `shareable_id`: type `string`, size `50`, `required`. **Important**: Go to the "Indexes" tab and create a unique index on this attribute.
//        - `name`: type `string`, size `255`, `required`.
//
// 5. **Configure Permissions**:
//    - **For the `shares_table` collection:**
//      - Go to "Settings" -> "Permissions".
//      - Add role "All Users (role:all)" and grant them only READ access.
//      - Add role "Any (role:any)" and grant them only CREATE access. (So only logged-in companions can create a share document).
//
//    - **For `reminders_table`, `messages_table`, and `journal_table`:**
//      - These will now use user-specific permissions, so no collection-level permissions are needed for "All Users".
//
// 6. **Add Web Platform for Local Development**:
//    - Go back to your project dashboard's main page.
//    - Click "Add Platform" and choose "Web App".
//    - Give it a name (e.g., "Local Dev") and for the "Hostname", enter `localhost`.
//
// 7. **Save and Refresh**:
//    - Save this file with your new IDs, then refresh the application in your browser.
// =====================================================================


export const APPWRITE_PROJECT_ID = '68b201d3001d7dbcec43';
export const DATABASE_ID = '68b213e7001400dc7f21';
export const TASKS_COLLECTION_ID = 'reminders_table';
export const MESSAGES_COLLECTION_ID = 'messages_table';
export const SHARES_COLLECTION_ID = 'shares_table';
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