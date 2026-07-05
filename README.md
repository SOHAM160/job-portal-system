# HireHub - AI Powered Job Portal

An AI-powered MERN Stack Job Portal that connects recruiters and candidates with ATS Resume Analysis, AI Recommendations, Real-time Chat, Google OAuth, Resume Management, and Smart Hiring tools.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)

![Socket.io](https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socket.io)

![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)

![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)

![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google)

![Brevo](https://img.shields.io/badge/Brevo-0B996E?style=for-the-badge)

![Gemini](https://img.shields.io/badge/Gemini_AI-8E75FF?style=for-the-badge)

![Groq](https://img.shields.io/badge/Groq-black?style=for-the-badge)


# Live Demo

Frontend:
https://job-portal-system-omega.vercel.app

Backend:
https://hirehub-backend-lcxx.onrender.com

# Features

- Candidate Dashboard
- Recruiter Dashboard
- AI Resume Analysis
- ATS Resume Scoring
- Resume Upload & Viewer
- Google OAuth Login
- JWT Authentication
- Real-time Chat (Socket.IO)
- Company Management
- Job Posting
- Job Applications
- Candidate Recommendations
- Brevo Email Notifications
- Cloudinary Resume Storage
- Responsive UI

# Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT
- Socket.IO

### AI
- Gemini API
- Groq API

### Cloud
- Cloudinary
- Brevo
- Render
- Vercel

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS (Browser)                              │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐   │
│   │                    FRONTEND  (Vite + React 19)                      │   │
│   │                    Deployed on: Vercel                               │   │
│   │                    Port: 5173 (dev)                                  │   │
│   │                                                                      │   │
│   │  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────────┐   │   │
│   │  │ React    │  │ React     │  │ Framer   │  │ Tailwind CSS v4   │   │   │
│   │  │ Router 7 │  │ Context   │  │ Motion   │  │ + Lucide Icons    │   │   │
│   │  └──────────┘  └───────────┘  └──────────┘  └───────────────────┘   │   │
│   │  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────────┐   │   │
│   │  │ Axios    │  │ Recharts  │  │Socket.IO │  │ Google OAuth      │   │   │
│   │  │ (HTTP)   │  │ (Charts)  │  │ Client   │  │ (@react-oauth)    │   │   │
│   │  └──────────┘  └───────────┘  └──────────┘  └───────────────────┘   │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│                          │ HTTPS (REST)          │ WSS (WebSocket)           │
└──────────────────────────┼───────────────────────┼──────────────────────────┘
                           │                       │
                           ▼                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                       BACKEND  (Node.js + Express)                           │
│                       Deployed on: Render                                    │
│                       Port: 5000                                             │
│                                                                              │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Express   │  │  Socket.IO   │  │  Middleware  │  │ External Services   │  │
│  │ REST API  │  │  Server      │  │  Pipeline    │  │                     │  │
│  └─────┬─────┘  └──────┬───────┘  └──────┬──────┘  │ • Google Gemini AI  │  │
│        │               │                 │          │ • Google OAuth      │  │
│        ▼               ▼                 ▼          │ • Cloudinary (CDN)  │  │
│  ┌─────────────────────────────────────────────┐    │ • Brevo (Email)     │  │
│  │              Mongoose ODM                   │    └─────────────────────┘  │
│  └─────────────────┬───────────────────────────┘                             │
│                    │                                                         │
└────────────────────┼─────────────────────────────────────────────────────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   MongoDB Atlas     │
          │   (Cloud Database)  │
          └─────────────────────┘

