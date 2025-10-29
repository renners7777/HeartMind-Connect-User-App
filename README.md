# HeartMind Connect: Stroke Support Companion

This is the user-facing application for HeartMind Connect, an AI-powered companion designed to support stroke survivors in their daily lives.

**This project was bootstrapped and developed using Google AI Studio.**

## Purpose

The journey of recovery after a stroke presents unique challenges. This application aims to provide a reliable and intuitive tool to help survivors regain independence, stay organized, and remain connected with their support network. By leveraging voice commands and a simple interface, it assists with managing daily tasks, tracking progress, and facilitating communication, reducing cognitive load and empowering users.

## Key Features

*   **Daily Task Management:** Users can add and complete daily tasks, helping to structure their day and build routine. Tasks can be added via voice command for ease of use.
*   **Progress Tracking:** Visual charts and summaries show the user's task completion over time, offering encouragement and a clear view of their progress.
*   **Companion Chat:** A simple chat interface allows users to send messages to their designated support companion (e.g., a family member or caregiver) who can view them in a separate companion app.
*   **Voice-Powered Interaction:** Powered by the Gemini API, the app accepts voice commands for key actions like adding tasks, sending messages, and navigating between screens. This provides a hands-free, accessible way to interact with the app.
*   **Companion App Link:** Provides a direct link to the companion web app where caregivers can view messages and monitor progress.

## Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **AI & Voice:** Google Gemini API (Live API for real-time voice interaction)
*   **Backend & Database:** Appwrite Cloud (for real-time database and user sessions)
*   **Development Environment:** Google AI Studio

## Getting Started

To run this application locally, you must first set up your own backend using Appwrite Cloud. This is a free and necessary step to store your app's data.

### 1. Set Up Your Appwrite Backend

First, follow the detailed setup instructions in the configuration file:

1.  In your code editor, open the file: `services/appwriteConfig.ts`
2.  Follow all the steps written in the comments at the top of that file. This will guide you through:
    *   Creating a free Appwrite project.
    *   Creating a database and the required collections (`Tasks`, `Messages`).
    *   Adding the necessary attributes (`text`, `completed`, etc.) to your collections.
    *   Setting the correct permissions so your app can access the data.
    *   Adding `localhost` as an allowed hostname for local development.
3.  Once you have completed the steps, **paste your new Project, Database, and Collection IDs into `services/appwriteConfig.ts`** and save the file.

### 2. Run the Application Locally

Once your backend is configured, you can run the front-end application.

*   **Prerequisites:** You need to have [Node.js](https://nodejs.org/) installed to use `npx`.

*   **Start the server:** This project is a static site and needs to be served by a web server. The simplest way is to use the `serve` package. In the project's root directory, open your terminal and run:
    ```bash
    npx serve
    ```
    This will start a local web server, typically at `http://localhost:3000`. Open this URL in your browser.

### 3. Provide Google AI API Key

The first time you try to use the voice input feature (the microphone button), the application will prompt you to enter your Google AI API Key. This key is required for the voice command functionality.

*   You can get a free API key from [Google AI Studio](https://aistudio.google.com/).
*   The key will be stored securely in your browser's local storage for future sessions, so you only need to enter it once.
