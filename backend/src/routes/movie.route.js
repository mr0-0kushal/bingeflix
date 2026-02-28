import { Router } from "express";
import {
    searchMovie,
    createMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    getMovieReviews,
    updateMovie
} from "../controllers/movie.contoller.js"
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";


const router = Router()

router.route('/search').get(searchMovie)
router.route("/").get(getAllMovies);
router.route('/create').post(verifyJWT, isAdmin, createMovie);
router.route('/:id/reviews').get(getMovieReviews);
router.route('/:id').get(getMovieById).delete(verifyJWT, isAdmin, deleteMovie).put(verifyJWT, isAdmin, updateMovie);

export default router
