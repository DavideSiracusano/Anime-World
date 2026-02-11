import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../controllers/favoriteControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tutte le rotte richiedono autenticazione (verifyToken)
router.get("/", verifyToken, getFavorites); // GET /api/favorites
router.post("/", verifyToken, addFavorite); // POST /api/favorites
router.delete("/:mal_id", verifyToken, removeFavorite); // DELETE /api/favorites/:mal_id
router.get("/:mal_id", verifyToken, isFavorite); // GET /api/favorites/:mal_id

export default router;
