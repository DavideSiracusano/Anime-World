import express from "express";
import {
  login,
  signup,
  logout,
  getMe,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rotte per autenticazione prese dai controller
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
