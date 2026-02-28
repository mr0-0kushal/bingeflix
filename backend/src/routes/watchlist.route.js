// routes/watchlist.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addToWatchlist,
    getMyWatchlist,
    getWatchlistItemByMovie,
    getWatchlistStats,
    upsertWatchlistItemByMovie,
    updateWatchlistItem,
    removeFromWatchlist
} from "../controllers/watchlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, addToWatchlist);
router.route("/").get(verifyJWT, getMyWatchlist);
router.route("/stats").get(verifyJWT, getWatchlistStats);
router.route("/movie/:movieId").get(verifyJWT, getWatchlistItemByMovie);
router.route("/movie/:movieId").patch(verifyJWT, upsertWatchlistItemByMovie);
router.route("/movie/:movieId").put(verifyJWT, upsertWatchlistItemByMovie);
router.route("/:id").put(verifyJWT, updateWatchlistItem);
router.route("/:id").patch(verifyJWT, updateWatchlistItem);
router.route("/:id").delete(verifyJWT, removeFromWatchlist);

export default router;
