import express from "express";
import { getTopics, createTopic } from "../controllers/topicsControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTopics);
router.post("/", verifyToken, createTopic);

export default router;
