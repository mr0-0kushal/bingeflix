import axios from "axios";
import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const searchMovie = asyncHandler(async (req, res) => {
    const { title, year} = req.query;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    // 1️⃣ Check DB first
    const existingMovie = await Movie.findOne({ title: new RegExp(title, "i") });

    if (existingMovie) {
        return res.status(200).json(
            new ApiResponse(200, existingMovie, "Movie fetched from database")
        );
    }

    // 2️⃣ Fetch from OMDB
    const response = await axios.get(
        `http://www.omdbapi.com/`,
        {
            params: {
                t: title,
                apikey: process.env.OMDB_API_KEY,
                y: year
            }
        }
    );

    if (response.data.Response === "False") {
        throw new ApiError(404, "Movie not found");
    }
    console.log(response);
    const data = response.data;

    // 3️⃣ Save to DB
    const movie = await Movie.create({
        imdbID: data.imdbID,
        title: data.Title,
        year: data.Year,
        genre: data.Genre?.split(",").map(g => g.trim()),
        cast: data.Actors?.split(",").map(a => a.trim()),
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const movies = await Movie.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Movie.countDocuments();

    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page,
            pages: Math.ceil(total / limit),
            movies
        }, "Movies fetched")
    );
});

const deleteMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
        throw new ApiError(404, "Movie not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Movie deleted")
    );
})

const updateMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    if (!updatedMovie) {
        throw new ApiError(404, "Movie not found");
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
    updateMovie
}