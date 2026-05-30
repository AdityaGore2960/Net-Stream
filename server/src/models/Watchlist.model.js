import mongoose from 'mongoose';

/**
 * Watchlist Schema
 */
const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['movie', 'tv'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
    voteAverage: {
      type: Number,
    },
    releaseDate: {
      type: String,
    },
    overview: {
      type: String,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Compound unique index so a user cannot add the same movie/show twice
watchlistSchema.index({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
