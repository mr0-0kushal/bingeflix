import axios from "axios";
import mongoose from "mongoose";
import { Movie } from "../models/movie.model.js";
import { Watchlist } from "../models/watchlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const normalizeString = (value) => {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str.length ? str : undefined;
};

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeArray = (value) => {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) {
    const arr = value.map((v) => String(v).trim()).filter(Boolean);
    return arr;
  }
  const str = String(value).trim();
  if (!str) return [];
  return str.split(",").map((v) => v.trim()).filter(Boolean);
};

const resolvePosterUrl = async (req, fallbackPoster) => {
  const posterFromBody = normalizeString(req.body.poster);

  if (req.file?.buffer) {
    const uploaded = await uploadOnCloudinary(req.file.buffer);
    const uploadedPoster = uploaded?.secure_url || uploaded?.url;
    if (!uploadedPoster) {
      throw new ApiError(500, {}, "Poster upload failed");
    }
    return uploadedPoster;
  }

  if (posterFromBody) {
    return posterFromBody;
  }

  return fallbackPoster;
};

const buildMoviePayload = async (req, { allowPartial = false, fallbackPoster = undefined } = {}) => {
  const title = normalizeString(req.body.title);
  const year = normalizeString(req.body.year);
  const genre = normalizeArray(req.body.genre);
  const cast = normalizeArray(req.body.cast);
  const plot = normalizeString(req.body.plot);
  const language = normalizeString(req.body.language);
  const runtime = normalizeString(req.body.runtime);
  const imdbID = normalizeString(req.body.imdbID);
  const poster = await resolvePosterUrl(req, fallbackPoster);

  if (!allowPartial && !title) {
    throw new ApiError(400, {}, "Title is required");
  }

  const payload = {};

  if (title !== undefined) payload.title = title;
  if (year !== undefined) payload.year = year;
  if (genre !== undefined) payload.genre = genre;
  if (cast !== undefined) payload.cast = cast;
  if (plot !== undefined) payload.plot = plot;
  if (language !== undefined) payload.language = language;
  if (runtime !== undefined) payload.runtime = runtime;
  if (imdbID !== undefined) payload.imdbID = imdbID;
  if (poster !== undefined) payload.poster = poster;

  return payload;
};

const searchMovie = asyncHandler(async (req, res) => {
  const { title, year } = req.query;
  const normalizedTitle = normalizeString(title);
  const normalizedYear = normalizeString(year);

  if (!normalizedTitle) {
    throw new ApiError(400, {}, "Title is required");
  }

  const titleRegex = new RegExp(`^${escapeRegex(normalizedTitle)}$`, "i");
  const existingMovie = await Movie.findOne({
    title: titleRegex,
    ...(normalizedYear ? { year: normalizedYear } : {})
  });

  if (existingMovie) {
    return res.status(200).json(
      new ApiResponse(200, existingMovie, "Movie fetched from database")
    );
  }

  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      t: normalizedTitle,
      apikey: process.env.OMDB_API_KEY,
      ...(normalizedYear ? { y: normalizedYear } : {})
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
  const payload = await buildMoviePayload(req, { allowPartial: false });

  const movie = await Movie.create({
    ...payload,
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

  const existing = await Movie.findById(id);
  if (!existing) {
    throw new ApiError(404, {}, "Movie not found");
  }

  const payload = await buildMoviePayload(req, {
    allowPartial: true,
    fallbackPoster: existing.poster
  });

  if (!Object.keys(payload).length) {
    throw new ApiError(400, {}, "No valid fields provided for update");
  }

  const updatedMovie = await Movie.findByIdAndUpdate(id, payload, { new: true });

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
