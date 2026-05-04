# khudsekrle (AI Code Analysis & Debugger)

A production-ready full-stack application for intelligent code analysis, security auditing, and optimization.

## 🚀 Project Vision
**khudsekrle** is built to help developers write better code. It identifies logical errors, security risks, and performance bottlenecks, providing clear explanations and optimized solutions in real-time.

## ✨ Features
- **Smart Code Audit**: Identify syntax and logical errors instantly.
- **Security Evaluation**: Check your code against common security standards (OWASP).
- **Complexity Analysis**: Understand the time and space complexity of your algorithms.
- **AI Assistant**: Chat with an AI to get deeper insights into your code.
- **Developer Notes**: Save notes and track your analysis history.
- **Modern Design**: Clean, dark-themed interface with smooth animations.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Monaco Editor, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Atlas), Groq API (Inference Engine).
- **Security**: JWT, Bcrypt, Helmet, Express Rate Limit, CORS.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Connection String
- Groq Cloud API Key

### Installation

1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Configure .env with MONGODB_URI, JWT_SECRET, GROQ_API_KEY
   npm start
   ```
3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🚢 Deployment
- **Backend**: Optimized for Render or Heroku. Uses `render.yaml` for automated blueprinting.
- **Frontend**: Recommended deployment on Vercel with `VITE_API_URL` pointing to the backend nexus.

## 📄 Documentation
- **Architecture**: See `brain/documentation.md` for the system design document.
- **Q&A**: See `brain/viva_qa.md` for technical deep-dives and exam prep.

---
*Built with precision for the modern developer.*
