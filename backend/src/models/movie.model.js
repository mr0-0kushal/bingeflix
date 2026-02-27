// models/movie.model.js

import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
    imdbID: {
        type: String,
        unique: true,
        sparse: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    year: String,
    genre: [String],
    cast: [String],
    plot: String,
    poster: String,
    language: String,
    runtime: String,

    averageRating: {
        type: Number,
        default: 0
    },
    ratingsCount: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

movieSchema.index({ title: "text" },
    {default_language: "english", language_override: "none"}
);

export const Movie = mongoose.model("Movie", movieSchema);