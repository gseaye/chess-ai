
# App Configuration Guide

This application uses AI models from multiple providers. To function correctly, it requires API keys and other settings for each service you wish to use.

## Primary Method: In-App Settings Panel

The easiest way to configure the app is through the built-in settings panel.

1.  Click the **Settings icon** (a gear) in the top-right corner of the application.
2.  A modal window will appear with input fields for each AI provider and the game time.
3.  Fill in the required credentials for the models you want to use. These settings are stored in your browser's `localStorage`.
4.  **Game Time Length**: Enter the maximum total thinking time each player has, in seconds. If a player's total time exceeds this limit, they lose the game. Set to `0` for no time limit.
5.  Click **"Save"**.

---

## Alternative Method: Environment Variables

For deployment, you can configure credentials using **Environment Variables** (also known as "Secrets"). The application uses these as a fallback if no settings are found in `localStorage`.

### 1. Google (Gemini)
-   **Secret Name:** `GEMINI_API_KEY` (or `API_KEY`)
-   **How to get a key:** Visit the [Google AI Studio API keys page](https://makersuite.google.com/app/apikey).

### 2. OpenAI (ChatGPT)
-   **Secret Name:** `OPENAI_API_KEY`
-   **How to get a key:** Visit the [OpenAI API keys page](https://platform.openai.com/api-keys).

### 3. Anthropic (Claude)
-   **Secret Name:** `ANTHROPIC_API_KEY`
-   **How to get a key:** Visit the [Anthropic Console API keys page](https://console.anthropic.com/settings/keys).

### 4. DeepSeek
-   **Secret Name:** `DEEPSEEK_API_KEY`
-   **How to get a key:** Visit the [DeepSeek Platform](https://platform.deepseek.com/api_keys).

### 5. Mistral
-   **Secret Name:** `MISTRAL_API_KEY`
-   **How to get a key:** Visit the [Mistral Platform](https://console.mistral.ai/api-keys/).

### 6. IBM (Watsonx)
IBM requires three separate pieces of information.
-   **Secret Name (Key):** `IBM_API_KEY`
    -   **How to get:** In your IBM Cloud account, go to `Manage > Access (IAM) > API keys`. Create a new key.
-   **Secret Name (Project ID):** `IBM_PROJECT_ID`
    -   **How to get:** In IBM Cloud, go to your Watsonx.ai project. Under the `Manage` tab, find the `Project ID` in the project details.
-   **Secret Name (Region):** `IBM_REGION`
    -   **How to get:** This is the region your Watsonx.ai service is hosted in (e.g., `us-south`, `eu-de`).
---

If credentials are missing, you will see an error message in the UI when you try to make an AI move with a model from that provider.
