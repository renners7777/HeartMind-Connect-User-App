# HeartMind Connect: Stroke Support Companion

This is the user-facing application for HeartMind Connect, an AI-powered companion designed to support stroke survivors in their daily lives.

**This project was bootstrapped and developed using Google AI Studio.**

## Purpose

The journey of recovery after a stroke presents unique challenges. This application aims to provide a reliable and intuitive tool to help survivors regain independence, stay organized, and remain connected with their support network. By leveraging voice commands and a simple interface, it assists with managing daily tasks, tracking progress, and facilitating communication, reducing cognitive load and empowering users.

## Key Features

* **Daily Task Management:** Users can add and complete daily tasks, helping to structure their day and build routine. Tasks can be added via voice command for ease of use.
* **Progress Tracking:** Visual charts and summaries show the user's task completion over time, offering encouragement and a clear view of their progress.
* **Companion Chat:** A simple chat interface allows users to send messages to their designated support companion (e.g., a family member or caregiver) who can view them in a separate companion app.
* **Voice-Powered Interaction:** Powered by the Gemini API, the app accepts voice commands for key actions like adding tasks, sending messages, and navigating between screens. This provides a hands-free, accessible way to interact with the app.
* **Companion App Link:** Provides a direct link to the companion web app where caregivers can view messages and monitor progress.

## Technology Stack

* **Frontend:** React, TypeScript, Tailwind CSS
* **AI & Voice:** Google Gemini API (Live API for real-time voice interaction)
* **Backend & Database:** Appwrite Cloud (for real-time database and user sessions)
* **Development Environment:** Google AI Studio

## Getting Started

To run this application locally, follow these steps:

### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your machine to use `npx`.

### Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2. **Start a local server:**
    This project is a static site and needs to be served by a web server to function correctly. The simplest way is to use `serve`. In the project's root directory, run:

    ```bash
    npx serve
    ```

    This will typically start the server at `http://localhost:3000`.

3. **Configure Appwrite:**
    The application connects to a public Appwrite backend for data storage. For security, Appwrite requires you to register the hostname you are running the app from. If you are running locally, you must add `localhost` as an authorized hostname in your Appwrite project's "Platforms" section.

4. **Provide Google AI API Key:**
    The first time you try to use the voice input feature, the application will prompt you to enter your Google AI API Key. This key is required for the voice command functionality and will be stored securely in your browser's local storage for subsequent sessions. You can obtain a key from [Google AI Studio](https://aistudio.google.com/).
