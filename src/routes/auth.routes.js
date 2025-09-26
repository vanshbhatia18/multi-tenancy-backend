import Router from "express"
import { registerUser,loginUser,logoutUser } from "../controllers/auth/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",registerUser);
router.post("/loginUser",loginUser)
router.route("/logout").post(jwtVerify,logoutUser)

export default router;