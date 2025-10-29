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
//    - Inside your new database, create two Collections. After creating each, go to its "Attributes" tab to add fields.
//
//    - **Tasks Collection**:
//      - Create a collection (e.g., name it "Tasks"). Copy its "Collection ID" below.
//      - Add attributes:
//        - `text`: type `string`, size `255`, `required`
//        - `completed`: type `boolean`, `required`, default value `false`
//
//    - **Messages Collection**:
//      - Create another collection (e.g., name it "Messages"). Copy its "Collection ID" below.
//      - Add attributes:
//        - `text`: type `string`, size `1024`, `required`
//        - `sender`: type `string`, size `50`, `required`
//
// 5. **Configure Permissions**:
//    - For both the "Tasks" and "Messages" collections, go to the "Settings" tab.
//    - Under "Permissions", click "Add Role". Select "All Users (role:all)" and grant them
//      CREATE, READ, UPDATE, and DELETE permissions. This allows the app to function without user logins.
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
export const TASKS_COLLECTION_ID = 'PASTE_YOUR_TASKS_COLLECTION_ID_HERE';
export const MESSAGES_COLLECTION_ID = 'PASTE_YOUR_MESSAGES_COLLECTION_ID_HERE';

/**
 * A simple check to see if the user has updated the configuration placeholders.
 * @returns {boolean} True if the project appears to be configured.
 */
export const isAppwriteConfigured = () => {
    return APPWRITE_PROJECT_ID !== '68b201d3001d7dbcec43' &&
           DATABASE_ID !== '68b213e7001400dc7f21' &&
           TASKS_COLLECTION_ID !== 'PASTE_YOUR_TASKS_COLLECTION_ID_HERE' &&
           MESSAGES_COLLECTION_ID !== 'PASTE_YOUR_MESSAGES_COLLECTION_ID_HERE';
};
