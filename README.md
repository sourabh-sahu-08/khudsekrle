# khudsekrle    

AI-assisted code analysis and debugging workspace built with React, Vite, Express, MongoDB, and Groq.     

## Overview

`khudsekrle` helps developers review code faster with a workflow centered on:

- bug and edge-case detection
- security-oriented analysis
- corrected and optimized code suggestions
- searchable report history
- follow-up chat and comments on saved analyses

The app includes an authenticated frontend workspace, a persistent analysis history, and public sharing support for selected reports.

## Stack

- Frontend: React, Vite, Tailwind CSS, Monaco Editor, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose
- AI Provider: Groq
- Auth and Security: JWT, bcrypt, helmet, express-rate-limit, CORS

## Project Structure

```text
frontend/   React client and workspace UI
backend/    Express API, auth, analysis, persistence
render.yaml Render deployment blueprint
```

## Environment Variables

Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

Set `frontend/.env` if your API is not running on the default local address:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Development

Install dependencies:

```bash
npm install
npm run install:all
```

Start the app:

```bash
npm run dev
```

Run the frontend lint check:

```bash
npm run lint --prefix frontend
```

Build the frontend:

```bash
npm run build --prefix frontend
```

## Key Features

- In-browser code editing with Monaco
- AI-generated findings, explanation, corrected code, and optimized code
- Saved per-user analysis history
- Analysis detail pages with comments and follow-up chat
- Public share mode for selected reports
- Profile management and password updates

## Deployment Notes

- Backend is configured for platforms such as Render.
- Frontend can be deployed separately on Vercel, Netlify, or any static host.
- Ensure `VITE_API_URL` points to the deployed backend API.

## Status

This repository is set up for full-stack local development and includes the core flows for authentication, analysis history, and report review.
