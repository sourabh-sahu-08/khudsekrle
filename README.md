# khudsekrle (AI-Powered Code Debugger and Explanation System)

A production-ready full-stack application for intelligent code analysis, debugging, and optimization.

## Features
- **Intelligent Debugging**: Detects syntax and logical errors using AI.
- **Simple Explanations**: Breaks down complex errors into beginner-friendly language.
- **Code Optimization**: Suggests more efficient versions of your code.
- **Complexity Analysis**: Provides Big-O time and space complexity.
- **Multi-language Support**: Supports C, C++, Java, Python, and JavaScript.
- **History Tracking**: View and manage previous analysis results in a personalized dashboard.
- **Modern UI**: Sleek dark-themed interface with Monaco Editor integration.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Monaco Editor, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Groq API (Llama 3.3).
- **Security**: JWT, Bcrypt, Helmet, CORS, Rate Limiting.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI
- Groq API Key

### Installation

1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file based on .env.example
   npm start
   ```
3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Deployment
- **Backend (Render)**:
  1. Connect your GitHub repository to Render.
  2. Select "Blueprint" to use the `render.yaml` file automatically.
  3. Alternatively, create a "Web Service" with:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
  4. Configure Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEY`.
- **Frontend**: Deploy to Vercel or Netlify. Ensure `VITE_API_URL` environment variable points to your Render backend URL.
- **Database**: Use MongoDB Atlas for a production-ready database.

## Documentation
Refer to `brain/documentation.md` for project abstract and system architecture.
Refer to `brain/viva_qa.md` for exam preparation.
