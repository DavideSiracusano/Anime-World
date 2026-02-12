import express from "express";
import {
  getComments,
  createComment,
} from "../controllers/commentsControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", verifyToken, createComment);

export default router;
