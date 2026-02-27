// models/watchlist.model.js

import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    userRating: {
        type: Number,
        min: 1,
        max: 5
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

/*
  🔥 This is CRITICAL
  Prevents duplicate movie for same user
*/
watchlistSchema.index(
    { user: 1, movie: 1 },
    { unique: true }
);

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);