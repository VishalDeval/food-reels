# Food Reel

A short-video food discovery application built using React, Express, MongoDB, and ImageKit. Think TikTok or Instagram Reels, but specifically tailored for restaurants and food lovers to explore dishes through engaging short video clips.

---

## Purpose and Vision

### Why Food Reel was Created
Traditional food delivery and discovery platforms rely heavily on static photos, star ratings, and text reviews. While useful, static images often fail to capture the real essence of a dish—such as the sizzle of a hot plate, melted cheese pulls, fresh garnishing, or the actual portion size. 

Food Reel was created to modernize food discovery by replacing static menus with a dynamic, video-first feed. It leverages the addictive and immersive nature of short-form vertical videos (similar to TikTok or Instagram Reels) to make exploring food interactive, visual, and entertaining.

### The Aim of Building Food Reel
1. **Visual-First Discovery**: Help food lovers decide what to eat based on real, authentic video previews of dishes rather than misleading or edited static photos.
2. **Empowering Local Food Partners**: Provide local restaurants, cloud kitchens, and food vendors with a dedicated, low-friction platform to showcase their culinary creations directly to nearby customers without needing high-budget video production or marketing teams.
3. **Connecting Diners with Restaurants**: Every reel links directly to the restaurant's store profile, making it effortless for users to discover local eateries and view their full menu catalog.

---

## Use Cases

### For Food Enthusiasts and Customers
- **Immersive Feed Browsing**: Scroll through a seamless vertical feed of food videos with auto-play and sound controls.
- **Save and Like Dishes**: Save dishes to personal collections or bookmark restaurants to try later.
- **Direct Store Access**: Tap "Visit Store" on any reel to view the food partner's profile, total meals offered, and full video menu catalog.

### For Restaurants and Food Partners
- **Easy Video Uploads**: Food partners can record a short video clip of a signature dish, add a title and description, and publish it directly from their dashboard.
- **Organic Local Reach**: Reach prospective customers through visual storytelling that showcases dish quality, preparation, and presentation.
- **Business Profile Management**: Maintain a dedicated store page highlighting all uploaded dishes and customer metrics.

---

## Features

- **Vertical Reels Feed**: Full-screen, scroll-snap video feed with auto-play, mute/unmute toggle, like and save actions.
- **Dual User Auth System**:
  - **Food Seekers (Users)**: Browse video feed, view dish descriptions, visit restaurant profiles, like/save dishes.
  - **Food Partners (Restaurants)**: Register business accounts, upload food videos with title & description, and maintain a partner profile.
- **Cloud Video Management**: Video uploads processed in memory via Multer and stored on ImageKit for streaming.
- **JWT Authentication**: Token & cookie-based authorization protecting backend API routes and frontend page access.

---

## Tech Stack

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

## Quick Start

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

## Project Structure

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

## API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/user/register` | Register a new user | No |
| `POST` | `/api/auth/user/login` | Login user | No |
| `POST` | `/api/auth/foodPartner/register` | Register a food partner | No |
| `POST` | `/api/auth/foodPartner/login` | Login food partner | No |
| `GET` | `/api/food/` | Get all food reel items for feed | Yes (User) |
| `POST` | `/api/food/` | Upload a new food reel (video + details) | Yes (Partner) |
| `GET` | `/api/food-partner/:id` | Get food partner profile & dishes | Yes |

---

## License

[ISC](LICENSE)
