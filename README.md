# CareVoice – Voice Enabled Elderly Health Assistant 🕊️

Welcome to **CareVoice**! This is a complete student demo project designed for elderly care management with an emphasis on a clean UI, accessibility, and high contrast design. 

This repository includes a fully functioning Front-End React simulation and a Back-End Node.js API with a PostgreSQL schema layout.

## 🚀 How to Run the Demo Immediately

Because this is a demo presentation project, we have structured the Front-End so that you **DO NOT need to run NPM, Node, or any build tools** to show off your application!

1. Open the folder `C:\Users\mdsam\.gemini\antigravity\scratch\silvercare`.
2. Double click the **`index.html`** file so it opens in your web browser (Chrome, Edge, Firefox, etc.).
3. The React code will compile dynamically via CDN instantly and your application will be loaded!

## 🎯 Features Showcased in the Demo Web App

- **Unified Dashboard**: Shows today's medicines, risk score, and quick actions.
- **Voice-Enabled AI Assistant**: Uses the browser's native Web Speech API to convert voice inquiries into text. It features an integrated simulated chat experience.
- **Medication Management**: Toggle medications between "Taken" and "Missed". Uses Voice alerts to notify the elderly patient dynamically. Missing medications updates your "Risk Level."
- **Emergency SOS Response**: A large red pulse button that when clicked mocks contacting GPS services and Emergency contacts. 
- **Doctors & Medical Shops**: Displays simulated local clinics with ratings and openness status using high-contrast design.
- **Dark / Light Theme Toggle**: Provides maximum visibility according to the user's preference.

## 🏗 Full-Stack Setup (Optional for Advanced Presentation)

If you are requested to present the **Backend Code (Node.js & Express)** or **Database Structure (PostgreSQL)**, you can find them in the `backend/` and `database/` folders.

### 1. Database (PostgreSQL)
Ensure you have PostgreSQL installed. Open pgAdmin or your terminal and create a database named `silvercare`.
Run the SQL queries inside `database/schema.sql` to generate your Tables, Roles, and mock data.

### 2. Backend API (Node.js/Express)
1. Open your terminal and navigate to the `backend/` folder.
2. Run `npm init -y`
3. Run `npm install express pg cors dotenv openai`
4. Create a `.env` file with your `DB_USER`, `DB_PASSWORD`, and optionally `OPENAI_API_KEY`.
5. Start the server by running `node server.js`.

The backend includes routing endpoints for Chatting with OpenAI, triggering Emergency SOS SMS simulations, and managing Medication statuses!

## 🎨 UI & UX Best Practices Applied

* **Typography**: Used `Outfit` from Google Fonts with default sizes `18px+` for enhanced readability.
* **Colors**: Optimized for color blindness with high-contrast distinct markers (Red for misses, Green for success, Orange for warnings).
* **Navigation**: Minimized clicks and kept interactions on one single page routing architecture. Added clear button shadows and micro-animations for responsiveness.
