import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from 'axios'


function createOMDBUrl(title) {
    const encodedTitle = encodeURIComponent(title.trim());
    const baseUrl = `http://www.omdbapi.com/?t=${encodedTitle}&apikey=d2726b15`;
    return baseUrl;
}

const getAllVideo = asyncHandler(async (req, res) => {
    try {
        const videos = await Video.find({})
        // console.log()
        if (videos.length == 0) {
            res.status(300)
                .json({
                    data: "NOTHING",
                    message: "There is no data!"
                })
        }
        res.status(200).json(new ApiResponse(200, {
            videos
        }, "Fetched Successfully"))
    } catch (error) {
        throw new ApiError(500, {}, "Something Went worng while fetching!")
    }
});

const fetchVideo = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body
        const url = createOMDBUrl(title);
        const filmRes = await axios.get(url)
        if (!filmRes?.data?.Response) {
            res.status(200).json({
                data: filmRes.data,
                message: "Not Found"
            })
        }
        res.status(200).json({
            data: filmRes.data,
            message: "Found"
        })
    } catch (error) {
        throw new ApiError(500, {}, error || "Internal server error while fetching")
    }
});

const listVideo = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body
        if (!title) {
            throw new ApiError(401, {}, "All fields are required!")
        }
        const url = createOMDBUrl(title);
        const filmRes = await axios.get(url)
        if (!filmRes.data.Response) {
            res.status(400).json({
                data: filmRes.data,
                message: "Not Found"
            })
        }
        const content = filmRes.data
        // console.log(content)
        const video = await Video.create({
            title,
            type: (content?.Type),
            genre: (content?.Genre).split(","),
            cast: (content?.Actors).split(","),
            description: content?.Plot,
            thumbnailUrl: content?.Poster,
            releaseDate: content?.Year,
            language: content?.Language,
            duration: content?.Runtime,
            rating: content?.Ratings,
        })
        // console.log(video)
        if (!video) {
            throw new ApiError(500, {}, "Error While creating entries")
        }
        res.status(200).
            json(
                new ApiResponse(200, video, "Video Added Sucessfully")
            )
    } catch (error) {
        throw new ApiError(500, {}, error || "Internal server error while inserting")
    }
});


export {
    getAllVideo,
    fetchVideo,
    listVideo
}