// server.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import topicsRoutes from "./routes/topicsRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import likesRoutes from "./routes/likesRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

interface CorsOptions {
  origin: string;
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/topics", topicsRoutes);
app.use("/api/topics/:topicId/comments", commentsRoutes);
app.use("/api/topics/:topicId/likes", likesRoutes);

process.on("SIGINT", async (): Promise<void> => {
  await disconnectDB();
  process.exit();
});

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
