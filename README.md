
# AI Champions League - Local Setup & Deployment Guide

This guide provides the definitive, industry-standard instructions for running and deploying the AI Champions League application.

The project is built with **Vite**, a modern and fast frontend tool.

---

## 1. Local Development

This is the recommended way to run the app on your local machine for development and testing. Vite provides a fast development server with Hot Module Replacement (HMR).

### Prerequisites
-   **Node.js**: Version 18 or higher. Download from [nodejs.org](https://nodejs.org/).

### Instructions

1.  **Install Dependencies**:
    Open your terminal, navigate to the project folder, and run:
    ```bash
    npm install
    ```
    This will download all necessary packages like React, Vite, and Tailwind CSS into a `node_modules` folder.

2.  **Run the Development Server**:
    Once installation is complete, run:
    ```bash
    npm run dev
    ```
    Your terminal will show a message like `> Local: http://localhost:5173/`. Open this URL in your browser. The application will be running, and it will automatically reload as you save changes to the source code.

3.  **Configure API Keys**:
    The application requires API keys to function.
    -   Click the **Settings icon (⚙️)** in the top-right corner.
    -   Enter your API keys in the panel. They are saved locally in your browser.
    -   Alternatively, for the dev server, you can create a `.env.local` file in the project root and add your keys there (see `.env.example`).

---

## 2. Deployment to Cloud (e.g., GCP Cloud Run)

This section explains how to build a production-ready container and deploy it.

### Build Process

The `npm run build` command compiles your application into a set of highly optimized static files (HTML, CSS, JavaScript) located in a `dist` folder.

### Deployment Strategy

We will use a **Docker container running Nginx** to serve these static files. This is a standard, efficient, and secure way to deploy a frontend application.

### Files Provided

-   `Dockerfile`: A recipe to build the production container. It uses a multi-stage build to keep the final image small.
-   `nginx.conf`: A configuration file for the Nginx web server inside the container.

### Step-by-Step Deployment to Google Cloud Run

1.  **Prerequisites**:
    -   [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured.
    -   [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.
    -   A GCP project with the Cloud Run and Artifact Registry APIs enabled.

2.  **Build the Docker Image**:
    In your terminal, from the project root, run this command. Replace `[PROJECT_ID]` and `[APP_NAME]` with your GCP project ID and a name for your app (e.g., `ai-champions-league`).
    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/[APP_NAME]
    ```
    This command uses Google Cloud Build to create the Docker image and push it to your project's container registry.

3.  **Deploy to Cloud Run**:
    Run the following command to deploy the container image to Cloud Run.
    ```bash
    gcloud run deploy [APP_NAME] \
      --image gcr.io/[PROJECT_ID]/[APP_NAME] \
      --platform managed \
      --region [YOUR_CHOSEN_REGION] \
      --allow-unauthenticated
    ```
    Replace `[APP_NAME]` and `[YOUR_CHOSEN_REGION]` (e.g., `us-central1`).

4.  **Configure API Keys for Production**:
    The deployed application will not have access to your local settings. You must provide the API keys as **environment variables** in Cloud Run.
    -   Go to your service in the Cloud Run section of the Google Cloud Console.
    -   Click "Edit & Deploy New Revision".
    -   Go to the "Variables & Secrets" tab.
    -   Add environment variables for each key your app needs, using the names from the `.env.example` file (e.g., `VITE_GEMINI_API_KEY`, `VITE_OPENAI_API_KEY`).
    -   Deploy the new revision.

Your application is now live and globally accessible!
