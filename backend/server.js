import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import topicsRoutes from "./routes/topicsRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import likesRoutes from "./routes/likesRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const prisma = connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/topics", topicsRoutes);
app.use("/api/topics/:topicId/comments", commentsRoutes);
app.use("/api/topics/:topicId/likes", likesRoutes);

process.on("SIGINT", async () => {
  await disconnectDB();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
