import express from "express";
import { getUserRecord, googleLogin } from "../controllers/googleAuth.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", googleLogin);
router.get("/", verifyUser, getUserRecord);

export default router;
