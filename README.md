# 🪔 Akshar AI — Setup Guide
**Indian-themed AI writing assistant powered by Groq + LLaMA 3.1 8B**

---

## 📁 Project Structure

```
akshar-ai/
├── server.js          ← Backend (keeps your API key hidden)
├── package.json       ← Node dependencies
├── .env               ← 🔐 Your secret Groq API key goes here
├── .gitignore         ← Prevents .env from being committed
└── public/
    └── index.html     ← The frontend website
```

---

## 🚀 Setup (3 steps)

### Step 1 — Install Node.js
Download and install Node.js from https://nodejs.org (choose the LTS version)

### Step 2 — Add your Groq API key
1. Get your free API key from https://console.groq.com
2. Open the `.env` file in a text editor
3. Replace `your_groq_api_key_here` with your actual key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 3 — Install & Run
Open a terminal in the `akshar-ai/` folder and run:

```bash
# Install dependencies (only needed once)
npm install

# Start the server
npm start
```

Then open your browser and go to:
**http://localhost:3000**

---

## 🌐 Sharing with others (Deploy online)

To let others use your Akshar AI, deploy it to a free hosting service:

### Option A — Railway (easiest, free tier)
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Push your project to GitHub first (make sure `.env` is in `.gitignore`!)
4. In Railway dashboard → go to your project → "Variables" tab
5. Add variable: `GROQ_API_KEY` = your key
6. Railway gives you a public URL like `https://akshar-ai.up.railway.app`

### Option B — Render (free tier)
1. Go to https://render.com and sign up
2. New → Web Service → connect your GitHub repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variable `GROQ_API_KEY` in the dashboard
6. Render gives you a public URL

### Option C — Run locally + share via ngrok (quick testing)
```bash
# Install ngrok from https://ngrok.com
ngrok http 3000
# Gives you a temporary public URL
```

---

## ⚠️ Security Notes

- **Never share your `.env` file** or commit it to GitHub
- The `.gitignore` already protects it — but double-check before pushing
- Your API key is never sent to users' browsers — it stays on the server
- The server has a built-in 8000 character limit per request to prevent abuse

---

## 🔧 Customisation

**Change the port:** Edit `PORT=3000` in `.env`

**Change the model:** In `server.js`, line with `model:`, replace with any Groq model:
- `llama-3.1-8b-instant` (fastest, free — default)
- `llama-3.1-70b-versatile` (smarter, slightly slower)
- `mixtral-8x7b-32768` (great for long texts)

**Point frontend to deployed backend:** In `public/index.html`, find:
```javascript
const API_URL = "/api/akshar";
```
Change to your deployed URL if frontend and backend are on separate services:
```javascript
const API_URL = "https://your-backend.railway.app/api/akshar";
```
