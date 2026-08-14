# 🍕 Food Reel

A short-video food discovery application built using React, Express, MongoDB, and ImageKit. Think TikTok or Instagram Reels, but specifically tailored for restaurants and food lovers to explore dishes through engaging short video clips.

---

## ✨ Features

- **🎬 Vertical Reels Feed**: Full-screen, scroll-snap video feed with auto-play, mute/unmute toggle, like and save actions.
- **👨‍🍳 Dual User Auth System**:
  - **Food Seekers (Users)**: Browse video feed, view dish descriptions, visit restaurant profiles, like/save dishes.
  - **Food Partners (Restaurants)**: Register business accounts, upload food videos with title & description, and maintain a partner profile.
- **📹 Cloud Video Management**: Video uploads processed in memory via Multer and stored on ImageKit for streaming.
- **🔐 JWT Authentication**: Token & cookie-based authorization protecting backend API routes and frontend page access.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Icons & HTTP**: Lucide React, Axios

### Backend
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Token (JWT) & bcrypt
- **File Storage**: ImageKit SDK + Multer

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally on default port `27017` (or updated in `backend/src/db/db.js`)
- [ImageKit](https://imagekit.io/) account for video upload keys

---

### 1. Clone the repository

```bash
git clone https://github.com/VishalDeval/food-reels.git
cd food-reels
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with your ImageKit credentials:

```env
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

Start the backend server:

```bash
npm start
```

The backend runs at `http://localhost:3000`.

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## 📂 Project Structure

```text
food-reel/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Auth, Food & Partner controllers
│   │   ├── db/               # MongoDB connection config
│   │   ├── middleware/       # JWT Auth middlewares
│   │   ├── models/           # User, FoodPartner & Food schemas
│   │   ├── routes/           # Express API endpoints
│   │   └── services/         # ImageKit storage service
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── auth/         # User & Partner Login/Register
    │   │   ├── food-partner/ # Dish creation & Partner profile
    │   │   └── general/      # Reels Home Feed
    │   ├── routes/           # App route declarations
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/user/register` | Register a new user | ❌ |
| `POST` | `/api/auth/user/login` | Login user | ❌ |
| `POST` | `/api/auth/foodPartner/register` | Register a food partner | ❌ |
| `POST` | `/api/auth/foodPartner/login` | Login food partner | ❌ |
| `GET` | `/api/food/` | Get all food reel items for feed | ✅ (User) |
| `POST` | `/api/food/` | Upload a new food reel (video + details) | ✅ (Partner) |
| `GET` | `/api/food-partner/:id` | Get food partner profile & dishes | ✅ |

---

## 📄 License

[ISC](LICENSE)
