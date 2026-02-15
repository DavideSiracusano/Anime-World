import express from "express";
import { getTopics, createTopic } from "../controllers/topicsControllers";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getTopics);
router.post("/", verifyToken, createTopic);

export default router;
