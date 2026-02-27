// controllers/watchlist.controller.js

import { Watchlist } from "../models/watchlist.model.js";
import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const addToWatchlist = asyncHandler(async (req, res) => {
    const { movieId } = req.body;

    if (!movieId) {
        throw new ApiError(400, "Movie ID required");
    }

    const movieExists = await Movie.findById(movieId);
    if (!movieExists) {
        throw new ApiError(404, "Movie not found");
    }

    const watchItem = await Watchlist.create({
        user: req.user._id,
        movie: movieId
    });

    return res.status(201).json(
        new ApiResponse(201, watchItem, "Added to watchlist")
    );
});

export const getMyWatchlist = asyncHandler(async (req, res) => {

    const watchlist = await Watchlist.find({ user: req.user._id })
        .populate("movie")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, watchlist, "Watchlist fetched")
    );
});

export const updateWatchlistItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { watched, userRating, notes } = req.body;

    const updatedItem = await Watchlist.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { watched, userRating, notes },
        { new: true }
    );

    if (!updatedItem) {
        throw new ApiError(404, "Watchlist item not found");
    }

    if (userRating !== undefined) {
        await updateMovieRatingStats(updated.movie);
    }

    return res.status(200).json(
        new ApiResponse(200, updatedItem, "Updated successfully")
    );
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const deleted = await Watchlist.findOneAndDelete({
        _id: id,
        user: req.user._id
    });

    if (!deleted) {
        throw new ApiError(404, "Watchlist item not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Removed from watchlist")
    );
});

export const updateMovieRatingStats = async (movieId) => {

    const ratings = await Watchlist.find({
        movie: movieId,
        userRating: { $exists: true }
    });

    if (ratings.length === 0) {
        await Movie.findByIdAndUpdate(movieId, {
            averageRating: 0,
            ratingsCount: 0
        });
        return;
    }

    const total = ratings.reduce((sum, item) => sum + item.userRating, 0);
    const avg = total / ratings.length;

    await Movie.findByIdAndUpdate(movieId, {
        averageRating: avg.toFixed(2),
        ratingsCount: ratings.length
    });
};