# ARAM Draft Pick (ADP)

A real-time draft application for League of Legends ARAM matches, enabling teams to strategically pick and ban champions in a competitive format.

## 🚀 Live Demo

**Live Application:** [https://haq-draft.vercel.app](https://haq-draft.vercel.app)

## 📖 Overview

ADP transforms casual ARAM games into strategic draft experiences with:

- **Real-time multiplayer drafting** with Socket.IO
- **Team-based champion selection** with pick/ban phases
- **Live timer management** for each draft phase
- **Responsive UI** built with Next.js and Tailwind CSS
- **Champion data integration** from Riot Games API

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.IO
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (frontend), Fly.io (backend)
- **State Management:** Zustand
- **Real-time:** Socket.IO WebSocket connections

## 🎯 Key Features

- **Room Creation:** Generate unique draft rooms for teams
- **Live Drafting:** Real-time pick/ban phases with turn timers
- **Champion Pool:** Browse and select from League of Legends champions
- **Team Management:** 2-team draft with spectator mode
- **Responsive Design:** Mobile-friendly interface
- **Error Handling:** Robust connection retry logic

## 🏗️ Architecture

```text
Frontend (Next.js) ←→ Backend (Node.js) ←→ Database (Supabase)
     ↓                    ↓
Socket.IO Client    Socket.IO Server
```

## 📱 Screenshots

### Room Creation

![Room Creation](https://github.com/Genoux/adp-frontend/tree/main/public/room.png)

### Planning Phase

![Planning Phase](https://github.com/Genoux/adp-frontend/tree/main/public/planning.png)
