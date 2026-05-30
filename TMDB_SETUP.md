# TMDB API Setup Guide

NetStream relies on the TMDB (The Movie Database) API for all movie, TV show, and actor data. To run this project locally, you will need to get your own API key.

## 1. Create a TMDB Account
1. Go to [The Movie Database (TMDB) website](https://www.themoviedb.org/).
2. Click on **Join TMDB** in the top navigation bar.
3. Fill out the registration form and verify your email.

## 2. Get Your API Key
1. Log in to your TMDB account.
2. Click on your profile icon in the top right corner and select **Settings**.
3. In the left sidebar, click on **API**.
4. Click on **Create** (or request an API key).
5. Choose **Developer** as the type of API key.
6. Accept the terms of use and fill in the required application details (you can just describe this as a personal learning project).
7. Once approved, you will see your **API Key (v3 auth)** and **Read Access Token (v4 auth)**.

## 3. Configure Environment Variables
You need to add these keys to the `client/.env` file in your NetStream project.

1. Open `client/.env`.
2. Replace the placeholder values with your actual keys:

```env
VITE_TMDB_API_KEY=your_v3_api_key_here
VITE_TMDB_READ_TOKEN=your_v4_read_access_token_here
```

> **Note:** The VITE_TMDB_READ_TOKEN is a long JWT string. Make sure you copy the entire string without any extra spaces.

## 4. API Rate Limits
- The TMDB API free tier allows up to **40 requests per 10 seconds** per IP address.
- If you exceed this, you will receive a `429 Too Many Requests` response.
- NetStream implements React Query which caches requests to minimize API calls and prevent rate limiting.

## 5. Image URLs
TMDB does not return full image URLs. It returns a path like `/poster.jpg`.
NetStream constructs the full URL using `getImageURL()` in `client/src/services/tmdb.js`:

Format: `https://image.tmdb.org/t/p/{size}/{file_path}`

Common Sizes:
- `w200`, `w300`, `w500` (Standard Posters)
- `w780`, `w1280` (Backdrops)
- `original` (Full resolution, use sparingly)

## 6. Useful Endpoints Reference
| Feature | Endpoint | Method |
|---------|----------|--------|
| Trending | `/trending/all/day` | GET |
| Movies Details | `/movie/{movie_id}` | GET |
| TV Details | `/tv/{tv_id}` | GET |
| Search | `/search/multi` | GET |
| Genres | `/genre/movie/list` | GET |
