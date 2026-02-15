import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../controllers/favoriteControllers";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, getFavorites);
router.post("/", verifyToken, addFavorite);
router.delete("/:mal_id", verifyToken, removeFavorite);
router.get("/:mal_id", verifyToken, isFavorite);

export default router;
