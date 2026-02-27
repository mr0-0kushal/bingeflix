import { Router } from "express";
import {
    searchMovie,
    createMovie,
    deleteMovie,
    getAllMovies,
    updateMovie
} from "../controllers/movie.contoller.js"
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.route('/search').get(searchMovie)
router.route("/").get(getAllMovies);
router.route('/create').post(verifyJWT, isAdmin, createMovie);
router.route('/:id').delete(verifyJWT, isAdmin, deleteMovie);
router.route('/:id').put(verifyJWT, isAdmin, updateMovie);

export default router
