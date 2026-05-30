# NetStream

<p align="center">
  A full-stack Netflix-inspired streaming discovery application built with React, Node.js, Express, MongoDB, and the TMDB API.
</p>

## Features
- [x] **Netflix-inspired Dark UI**: Premium `#0a0a0a` styling with red accents.
- [x] **Real-time Data**: Fetched from TMDB API.
- [x] **User Authentication**: Secure JWT-based auth via Express and MongoDB.
- [x] **My List / Watchlist**: Save movies and TV shows to your personal list.
- [x] **Movie & TV Details**: View overviews, cast, trailers, and similar content.
- [x] **Search**: Debounced live search across movies, TV, and people.
- [x] **Responsive Design**: Mobile, tablet, and desktop optimized.
- [x] **Smooth Animations**: Hover scaling, fade-ins, and modal transitions.

## Tech Stack

| Frontend | Backend | Tools & Deployment |
|----------|---------|--------------------|
| React 18 | Node.js | Vite |
| Tailwind CSS | Express | Docker |
| Zustand | MongoDB | ESLint / Prettier |
| React Query | Mongoose | Vercel (Client)* |
| Axios | JWT & Bcrypt | Railway (Server)* |

*\* Recommended deployment platforms*

## Prerequisites
- **Node.js**: v18+
- **MongoDB**: Local instance (port 27017) or MongoDB Atlas URI
- **TMDB API Key**: Free account required (See [TMDB_SETUP.md](./TMDB_SETUP.md))

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/netstream.git
   cd netstream
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```
   *(This script installs root, client, and server dependencies)*

3. **Configure Environment Variables:**
   - Client (`client/.env`):
     ```env
     VITE_TMDB_API_KEY=your_api_key
     VITE_TMDB_READ_TOKEN=your_read_token
     VITE_API_URL=http://localhost:5000/api
     ```
   - Server (`server/.env`):
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/netstream
     JWT_SECRET=your_secret
     JWT_REFRESH_SECRET=your_refresh_secret
     CLIENT_URL=http://localhost:5173
     ```

4. **Start MongoDB:** Ensure your MongoDB service is running.
   
5. **Run the application:**
   ```bash
   npm run dev
   ```
   *(Runs both client (5173) and server (5000) concurrently)*

## Available Pages
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home.jsx` | Main dashboard with rotating hero and trending rows |
| `/movies` | `Movies.jsx` | Browse movies by genre |
| `/tv` | `TVShows.jsx` | Browse TV shows by genre |
| `/my-list` | `MyList.jsx` | User's saved watchlist grid |
| `/movie/:id` | `MovieDetailPage.jsx` | Full details, trailer, and similar movies |
| `/tv/:id` | `MovieDetailPage.jsx` | Full details, trailer, and similar shows |
| `/search` | `Search.jsx` | Search results |
| `/login` | `Login.jsx` | User authentication |

## API Endpoints (Backend)
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Authenticate user
- `GET /api/auth/me`: Get current user (Protected)
- `GET /api/watchlist`: Get user's watchlist (Protected)
- `POST /api/watchlist`: Add item to watchlist (Protected)
- `DELETE /api/watchlist/:tmdbId`: Remove item (Protected)

## License
This project is licensed under the MIT License.
