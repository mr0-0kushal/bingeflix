// routes/watchlist.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addToWatchlist,
    getMyWatchlist,
    updateWatchlistItem,
    removeFromWatchlist
} from "../controllers/watchlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, addToWatchlist);
router.route("/").get( verifyJWT, getMyWatchlist);
router.route("/:id").put(verifyJWT, updateWatchlistItem);
router.route("/:id").delete(verifyJWT, removeFromWatchlist);

export default router;