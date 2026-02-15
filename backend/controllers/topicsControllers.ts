import type { Request, Response } from "express";
import { prisma } from "../config/db";

interface TopicBody {
  title: string;
  content: string;
}

const getTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topics = await prisma.topic.findMany({
      include: { user: true },
    });
    res.status(200).json({ success: true, data: topics });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const createTopic = async (
  req: Request<{}, {}, TopicBody>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, content } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const newTopic = await prisma.topic.create({
      data: {
        title,
        content,
        userId,
      },
      include: { user: true },
    });
    res.status(201).json({ success: true, data: newTopic });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getTopics, createTopic };
