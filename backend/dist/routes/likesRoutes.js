import express from "express";
import { getLikes, addLike, removeLike, checkUserLike, } from "../controllers/likesControllers";
import { verifyToken } from "../middleware/authMiddleware";
const router = express.Router({ mergeParams: true });
router.get("/", getLikes);
router.get("/check", verifyToken, checkUserLike);
router.post("/", verifyToken, addLike);
router.delete("/", verifyToken, removeLike);
export default router;
