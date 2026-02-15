import type { Request, Response } from "express";
import { prisma } from "../config/db";

const getLikes = async (
  req: Request<{ topicId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const topicId = parseInt(req.params.topicId);
    const likeCount = await prisma.like.count({
      where: { topicId },
    });
    res.json({ likeCount });
  } catch (error: any) {
    res.status(500).json({ error: "Errore nel recupero dei like" });
  }
};

const addLike = async (
  req: Request<{ topicId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const topicId = parseInt(req.params.topicId);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.deleteMany({
        where: {
          AND: [{ userId }, { topicId }],
        },
      });
      res.json({ success: true, action: "removed" });
    } else {
      const like = await prisma.like.create({
        data: {
          userId,
          topicId,
        },
      });
      res.json({ success: true, action: "added", data: like });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Errore nell'aggiunta del like" });
  }
};

const removeLike = async (
  req: Request<{ topicId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const topicId = parseInt(req.params.topicId);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const like = await prisma.like.delete({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });
    res.json({ success: true, data: like });
  } catch (error: any) {
    res.status(500).json({ error: "Errore nel rimozione del like" });
  }
};

const checkUserLike = async (
  req: Request<{ topicId: string }>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const topicId = parseInt(req.params.topicId);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });

    res.json({ liked: !!existingLike });
  } catch (error: any) {
    res.status(500).json({ error: "Errore nel controllo del like" });
  }
};

export { getLikes, addLike, removeLike, checkUserLike };
