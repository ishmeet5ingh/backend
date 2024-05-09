import { Router } from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/register").post(
    // injected middleware.
    // we can upload file now.
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    // multer gives req.files to controller as express gives req.body
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

router.route("/refresh-token").post(refreshAccessToken)

export default router