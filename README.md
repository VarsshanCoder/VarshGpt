# 🤖 VarshGpt — AI Chatbot with OpenAI API

VarshGpt is a sleek, cyberpunk‑themed AI chatbot built with **React (Vite)** on the frontend and **Node.js + Express + TypeScript** on the backend.  
It integrates the **OpenAI API** for chat, image generation, and file analysis

---

## ✨ Features
- 💬 **Conversational AI** — Powered by OpenAI's GPT models
- 🖼 **Image Generation** — `/image your prompt` creates AI images
- 📎 **File Analysis** — Upload files and get instant AI insights
- 🎨 **Cyberpunk UI** — Neon‑glow theme with responsive design
- 📋 **Copy‑Ready Code Blocks** — One‑click copy for any AI‑generated code
- 🔊 **Extensible** — Ready for voice input, TTS, and streaming

---

## 🛠 Tech Stack
**Frontend**
- React + Vite
- TypeScript
- Custom CSS (neon/cyberpunk theme)

**Backend**
- Node.js + Express
- TypeScript
- Multer (file uploads)
- OpenAI SDK

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/VarshGpt.git
cd VarshGpt
```
### 2. Install dependencies
**Backend**
```bash
cd backend
npm install
```
**Frontend**
```bash
cd ../frontend
npm install
```
### 3. Set up environment variables
**Create a .env file in backend/:**
```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=8787
```
**Create a .env file in frontend/:**
```bash
VITE_API_BASE=http://localhost:8787
```

### 🚀 Running Locally
**Backend**
```bash
cd backend
npm run dev
```
**Frontend**
```bash
cd frontend
npm run dev
```
**Open your browser at:**
```bash
http://localhost:5173
```

---
📸 Screenshots
![alt text](https://github.com/VarsshanCoder/VarshGpt/blob/main/Screenshot%202025-09-17%20183913.png)
![alt text](https://github.com/VarsshanCoder/VarshGpt/blob/main/Screenshot%202025-09-17%20183913.png)
