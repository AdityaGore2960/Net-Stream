import Watchlist from '../models/Watchlist.model.js';

/**
 * @desc    Get user watchlist
 * @route   GET /api/watchlist
 * @access  Private
 */
export const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to watchlist
 * @route   POST /api/watchlist
 * @access  Private
 */
export const addToWatchlist = async (req, res, next) => {
  try {
    const { tmdbId, mediaType, title, posterPath, backdropPath, voteAverage, releaseDate, overview } = req.body;

    if (!tmdbId || !mediaType) {
      return res.status(400).json({ success: false, message: 'Please provide tmdbId and mediaType' });
    }

    // Check if already in watchlist
    const exists = await Watchlist.findOne({ userId: req.user.id, tmdbId, mediaType });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Item already in watchlist' });
    }

    const newItem = await Watchlist.create({
      userId: req.user.id,
      tmdbId,
      mediaType,
      title,
      posterPath,
      backdropPath,
      voteAverage,
      releaseDate,
      overview,
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Item already in watchlist' });
    }
    next(error);
  }
};

/**
 * @desc    Remove item from watchlist
 * @route   DELETE /api/watchlist/:tmdbId
 * @access  Private
 */
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const tmdbId = req.params.tmdbId;
    const mediaType = req.query.mediaType || 'movie'; // Default to movie or expect query param

    const item = await Watchlist.findOneAndDelete({ userId: req.user.id, tmdbId, mediaType });
    
    if (!item) {
      // If we don't know the mediaType, let's try finding just by tmdbId
      const fallbackItem = await Watchlist.findOneAndDelete({ userId: req.user.id, tmdbId });
      if (!fallbackItem) {
        return res.status(404).json({ success: false, message: 'Item not found in watchlist' });
      }
    }

    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if item is in watchlist
 * @route   GET /api/watchlist/check/:tmdbId
 * @access  Private
 */
export const checkWatchlist = async (req, res, next) => {
  try {
    const tmdbId = req.params.tmdbId;
    const mediaType = req.query.mediaType;

    const query = { userId: req.user.id, tmdbId };
    if (mediaType) query.mediaType = mediaType;

    const item = await Watchlist.findOne(query);

    res.json({ success: true, inWatchlist: !!item });
  } catch (error) {
    next(error);
  }
};
