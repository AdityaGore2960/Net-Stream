import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist, checkWatchlist } from '../controllers/watchlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All watchlist routes are protected

router.route('/')
  .get(getWatchlist)
  .post(addToWatchlist);

router.route('/:tmdbId')
  .delete(removeFromWatchlist);

router.get('/check/:tmdbId', checkWatchlist);

export default router;
