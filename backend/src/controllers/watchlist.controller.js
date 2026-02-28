import mongoose from "mongoose";
import { Watchlist } from "../models/watchlist.model.js";
import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const WATCHLIST_MOVIE_FIELDS = "title poster year genre cast plot language runtime averageRating ratingsCount";

const parseBooleanQuery = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;

  const normalized = String(value).toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return undefined;
};

const getSortOption = (sortBy = "latest") => {
  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };
    case "rating":
      return { userRating: -1, createdAt: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
};

const buildWatchlistUpdateQuery = ({ watched, userRating, notes }) => {
  const setPayload = {};
  const unsetPayload = {};

  if (watched !== undefined) {
    setPayload.watched = Boolean(watched);
  }

  if (notes !== undefined) {
    setPayload.notes = String(notes);
  }

  if (userRating !== undefined) {
    if (userRating === null || userRating === "") {
      unsetPayload.userRating = 1;
    } else {
      const parsed = Number(userRating);
      if (Number.isNaN(parsed) || parsed < 1 || parsed > 5) {
        throw new ApiError(400, {}, "Rating must be between 1 and 5");
      }
      setPayload.userRating = parsed;
    }
  }

  const updateQuery = {};
  if (Object.keys(setPayload).length) updateQuery.$set = setPayload;
  if (Object.keys(unsetPayload).length) updateQuery.$unset = unsetPayload;

  return {
    setPayload,
    updateQuery,
    hasUpdates: Object.keys(updateQuery).length > 0,
    hasRatingChange: userRating !== undefined
  };
};

const getWatchlistSummary = async (userId) => {
  const [summary] = await Watchlist.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(String(userId)) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        watched: {
          $sum: { $cond: [{ $eq: ["$watched", true] }, 1, 0] }
        },
        ratedCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$userRating", null] },
                  { $gte: ["$userRating", 1] },
                  { $lte: ["$userRating", 5] }
                ]
              },
              1,
              0
            ]
          }
        },
        avgUserRating: {
          $avg: {
            $cond: [
              {
                $and: [
                  { $ne: ["$userRating", null] },
                  { $gte: ["$userRating", 1] },
                  { $lte: ["$userRating", 5] }
                ]
              },
              "$userRating",
              null
            ]
          }
        }
      }
    }
  ]);

  const total = summary?.total || 0;
  const watched = summary?.watched || 0;
  const pending = Math.max(total - watched, 0);
  const ratedCount = summary?.ratedCount || 0;
  const avgUserRating = summary?.avgUserRating ? Number(summary.avgUserRating.toFixed(2)) : 0;

  return {
    total,
    watched,
    pending,
    ratedCount,
    avgUserRating
  };
};

export const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId, watched = false, userRating, notes = "" } = req.body;

  if (!movieId || !mongoose.isValidObjectId(movieId)) {
    throw new ApiError(400, {}, "Valid movie ID is required");
  }

  if (userRating !== undefined && userRating !== null) {
    const parsed = Number(userRating);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > 5) {
      throw new ApiError(400, {}, "Rating must be between 1 and 5");
    }
  }

  const movieExists = await Movie.exists({ _id: movieId });
  if (!movieExists) {
    throw new ApiError(404, {}, "Movie not found");
  }

  const existing = await Watchlist.findOne({
    user: req.user._id,
    movie: movieId
  }).populate("movie", WATCHLIST_MOVIE_FIELDS);

  if (existing) {
    return res.status(200).json(
      new ApiResponse(200, existing, "Movie already in watchlist")
    );
  }

  let created;
  try {
    created = await Watchlist.create({
      user: req.user._id,
      movie: movieId,
      watched: Boolean(watched),
      userRating: userRating !== undefined && userRating !== null ? Number(userRating) : undefined,
      notes
    });
  } catch (error) {
    if (error?.code === 11000) {
      const item = await Watchlist.findOne({
        user: req.user._id,
        movie: movieId
      }).populate("movie", WATCHLIST_MOVIE_FIELDS);

      return res.status(200).json(
        new ApiResponse(200, item, "Movie already in watchlist")
      );
    }
    throw error;
  }

  const watchItem = await Watchlist.findById(created._id).populate("movie", WATCHLIST_MOVIE_FIELDS);

  if (userRating !== undefined && userRating !== null) {
    await updateMovieRatingStats(movieId);
  }

  return res.status(201).json(
    new ApiResponse(201, watchItem, "Added to watchlist")
  );
});

export const getMyWatchlist = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const watched = parseBooleanQuery(req.query.watched);
  const search = (req.query.search || "").trim();
  const sort = getSortOption(req.query.sort);

  const match = { user: req.user._id };
  if (watched !== undefined) {
    match.watched = watched;
  }

  if (search) {
    const matchedMovieIds = await Movie.find({
      title: new RegExp(search, "i")
    }).distinct("_id");

    if (matchedMovieIds.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, {
          total: 0,
          page,
          pages: 0,
          limit,
          summary: await getWatchlistSummary(req.user._id),
          items: []
        }, "Watchlist fetched")
      );
    }

    match.movie = { $in: matchedMovieIds };
  }

  const [total, items, summary] = await Promise.all([
    Watchlist.countDocuments(match),
    Watchlist.find(match)
      .populate("movie", WATCHLIST_MOVIE_FIELDS)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    getWatchlistSummary(req.user._id)
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page,
      pages: total ? Math.ceil(total / limit) : 0,
      limit,
      summary,
      items
    }, "Watchlist fetched")
  );
});

export const getWatchlistStats = asyncHandler(async (req, res) => {
  const summary = await getWatchlistSummary(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, summary, "Watchlist stats fetched")
  );
});

export const getWatchlistItemByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  if (!movieId || !mongoose.isValidObjectId(movieId)) {
    throw new ApiError(400, {}, "Invalid movie id");
  }

  const item = await Watchlist.findOne({
    user: req.user._id,
    movie: movieId
  }).populate("movie", WATCHLIST_MOVIE_FIELDS);

  return res.status(200).json(
    new ApiResponse(200, item || null, item ? "Watchlist item fetched" : "Watchlist item not found")
  );
});

export const upsertWatchlistItemByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { watched, userRating, notes } = req.body;

  if (!movieId || !mongoose.isValidObjectId(movieId)) {
    throw new ApiError(400, {}, "Invalid movie id");
  }

  const movieExists = await Movie.exists({ _id: movieId });
  if (!movieExists) {
    throw new ApiError(404, {}, "Movie not found");
  }

  const { setPayload, updateQuery, hasUpdates, hasRatingChange } = buildWatchlistUpdateQuery({
    watched,
    userRating,
    notes
  });

  const existing = await Watchlist.findOne({
    user: req.user._id,
    movie: movieId
  });

  if (!existing) {
    const createPayload = {
      user: req.user._id,
      movie: movieId,
      ...setPayload
    };

    const created = await Watchlist.create(createPayload);
    const populated = await Watchlist.findById(created._id).populate("movie", WATCHLIST_MOVIE_FIELDS);

    if (hasRatingChange) {
      await updateMovieRatingStats(movieId);
    }

    return res.status(201).json(
      new ApiResponse(201, populated, "Watchlist item created")
    );
  }

  let updatedItem;
  if (hasUpdates) {
    updatedItem = await Watchlist.findOneAndUpdate(
      { _id: existing._id, user: req.user._id },
      updateQuery,
      { new: true, runValidators: true }
    ).populate("movie", WATCHLIST_MOVIE_FIELDS);
  } else {
    updatedItem = await Watchlist.findById(existing._id).populate("movie", WATCHLIST_MOVIE_FIELDS);
  }

  if (hasRatingChange) {
    await updateMovieRatingStats(movieId);
  }

  return res.status(200).json(
    new ApiResponse(200, updatedItem, "Watchlist item updated")
  );
});

export const updateWatchlistItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { watched, userRating, notes } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, {}, "Invalid watchlist item id");
  }

  const { updateQuery, hasUpdates, hasRatingChange } = buildWatchlistUpdateQuery({
    watched,
    userRating,
    notes
  });

  if (!hasUpdates) {
    throw new ApiError(400, {}, "No valid fields to update");
  }

  const updatedItem = await Watchlist.findOneAndUpdate(
    { _id: id, user: req.user._id },
    updateQuery,
    { new: true, runValidators: true }
  ).populate("movie", WATCHLIST_MOVIE_FIELDS);

  if (!updatedItem) {
    throw new ApiError(404, {}, "Watchlist item not found");
  }

  if (hasRatingChange) {
    await updateMovieRatingStats(updatedItem.movie?._id || updatedItem.movie);
  }

  return res.status(200).json(
    new ApiResponse(200, updatedItem, "Watchlist item updated")
  );
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, {}, "Invalid watchlist item id");
  }

  const deleted = await Watchlist.findOneAndDelete({
    _id: id,
    user: req.user._id
  });

  if (!deleted) {
    throw new ApiError(404, {}, "Watchlist item not found");
  }

  await updateMovieRatingStats(deleted.movie);

  return res.status(200).json(
    new ApiResponse(200, {}, "Removed from watchlist")
  );
});

export const updateMovieRatingStats = async (movieId) => {
  if (!movieId || !mongoose.isValidObjectId(movieId)) {
    return;
  }

  const [stats] = await Watchlist.aggregate([
    {
      $match: {
        movie: new mongoose.Types.ObjectId(String(movieId)),
        userRating: { $gte: 1, $lte: 5 }
      }
    },
    {
      $group: {
        _id: "$movie",
        averageRating: { $avg: "$userRating" },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  if (!stats) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: 0,
      ratingsCount: 0
    });
    return;
  }

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: Number(stats.averageRating.toFixed(2)),
    ratingsCount: stats.ratingsCount
  });
};
