import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    genre: {
        type: [{
            type: String
        }],
        required: true
    },
    cast: {
        type: [{
            type: String
        }]
    },
    description:{
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    bannerUrl: {
        type: String
    },
    releaseDate: {
        type: Date
    },
    rating: {
        avg: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    views: { type: Number, default: 0 }
},
{
    timestamps: true,
    discriminatorKey: 'type'
}
)

export const Video = mongoose.model('Video', videoSchema)