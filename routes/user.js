import express from "express";
// import { getUserRecord, googleLogin } from "../controllers/googleAuth.js";
import { signup, login, getInfo } from "../controllers/user.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/", verifyUser, getInfo);

export default router;
