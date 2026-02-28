import axios from "axios";
import mongoose from "mongoose";
import { Movie } from "../models/movie.model.js";
import { Watchlist } from "../models/watchlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const searchMovie = asyncHandler(async (req, res) => {
  const { title, year } = req.query;

  if (!title) {
    throw new ApiError(400, {}, "Title is required");
  }

  const existingMovie = await Movie.findOne({ title: new RegExp(title, "i") });

  if (existingMovie) {
    return res.status(200).json(
      new ApiResponse(200, existingMovie, "Movie fetched from database")
    );
  }

  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      t: title,
      apikey: process.env.OMDB_API_KEY,
      y: year
    }
  });

  if (response.data.Response === "False") {
    throw new ApiError(404, {}, "Movie not found");
  }

  const data = response.data;

  const movie = await Movie.create({
    imdbID: data.imdbID,
    title: data.Title,
    year: data.Year,
    genre: data.Genre?.split(",").map((g) => g.trim()),
    cast: data.Actors?.split(",").map((a) => a.trim()),
    plot: data.Plot,
    poster: data.Poster,
    language: data.Language,
    runtime: data.Runtime
  });

  return res.status(200).json(
    new ApiResponse(200, movie, "Movie fetched from OMDB and cached")
  );
});

const createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create({
    ...req.body,
    createdBy: req.user._id
  });

  return res.status(201).json(
    new ApiResponse(201, movie, "Movie created by admin")
  );
});

const getAllMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [movies, total] = await Promise.all([
    Movie.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Movie.countDocuments()
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page,
      pages: Math.ceil(total / limit),
      movies
    }, "Movies fetched")
  );
});

const getMovieById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, {}, "Invalid movie id");
  }

  const movie = await Movie.findById(id);
  if (!movie) {
    throw new ApiError(404, {}, "Movie not found");
  }

  return res.status(200).json(
    new ApiResponse(200, movie, "Movie details fetched")
  );
});

const getMovieReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, {}, "Invalid movie id");
  }

  const movieExists = await Movie.exists({ _id: id });
  if (!movieExists) {
    throw new ApiError(404, {}, "Movie not found");
  }

  const reviews = await Watchlist.find({
    movie: id,
    $or: [
      { notes: { $exists: true, $ne: "" } },
      { userRating: { $gte: 1, $lte: 5 } }
    ]
  })
    .populate("user", "fullname username avatar")
    .select("user userRating notes watched createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .limit(100);

  return res.status(200).json(
    new ApiResponse(200, reviews, "Movie reviews fetched")
  );
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, {}, "Invalid movie id");
  }

  const deletedMovie = await Movie.findByIdAndDelete(id);

  if (!deletedMovie) {
    throw new ApiError(404, {}, "Movie not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Movie deleted")
  );
});

const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, {}, "Invalid movie id");
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!updatedMovie) {
    throw new ApiError(404, {}, "Movie not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedMovie, "Movie updated")
  );
});

export {
  searchMovie,
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  getMovieReviews,
  updateMovie
};
