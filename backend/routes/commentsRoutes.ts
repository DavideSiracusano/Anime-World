import express from "express";
import { getComments, createComment } from "../controllers/commentsControllers";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", verifyToken, createComment);

export default router;
