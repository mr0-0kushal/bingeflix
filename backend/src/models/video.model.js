import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  genre: {
    type: [String],
    required: true,
    // validate: v => Array.isArray(v) && v.length > 0
  },
  cast: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String,
    default: null
  },
  trailerUrl: {
    type: String,
    default: null
  },
  videoUrl: {
    type: String,
    default: null
  },
  releaseDate: {
    type: Date,
    required: true
  },
  language: {
    type: String,
    default: "English"
  },
  duration: {
    type: String, // e.g., "2h 15m" or "45min"
    default: null
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: [Object],
    default:[]
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    enum: ['movie', 'series'],
    required: true,
    default: 'movie'
  }
}, {
  timestamps: true,
  // discriminatorKey: 'type', // this can remain if you plan on extending schema later
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
});

// videoSchema.virtual('formattedRating').get(function () {
//   return `${this.rating.avg?.toFixed(1)} (${this.rating.count} votes)`;
// });

export const Video = mongoose.model('Video', videoSchema);
