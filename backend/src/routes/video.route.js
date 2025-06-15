import { Router } from "express";
import {
    getAllVideo,
    fetchVideo,
    listVideo
} from '../controllers/video.controller.js'
import { verifyJWT, verifyOTP } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.route('/').get(getAllVideo)
router.route('/fetch').get(fetchVideo)
router.route('/list-video').post(listVideo)

export default router
