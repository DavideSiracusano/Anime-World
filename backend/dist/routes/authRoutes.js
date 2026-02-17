import express from "express";
import { login, signup, logout, getMe } from "../controllers/authControllers";
import { verifyToken } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
export default router;
