# khudsekrle (Neural Code Audit & Optimization Nexus)

A high-fidelity, production-ready full-stack application for intelligent code analysis, security auditing, and architectural optimization.

## 🚀 Project Vision
**khudsekrle** is designed to be the ultimate companion for senior engineers. It doesn't just find bugs; it performs deep heuristic analysis to identify architectural flaws, security vulnerabilities, and performance bottlenecks, providing production-ready resolutions in real-time.

## ✨ Premium Features
- **Neural Audit Core**: Deep syntax and logical bug detection using Llama 3.3 (Groq).
- **Security Manifest**: Full evaluation against OWASP Top 10 security standards.
- **Complexity Heuristics**: Detailed Big-O time and space complexity justifications.
- **Architectural Chat**: Real-time consulting with an AI principal engineer about your audit results.
- **Developer Persistence**: Integrated developer notes and history tracking.
- **SaaS Aesthetics**: Premium dark-mode glassmorphism interface with fluid animations.

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
