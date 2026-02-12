import { prisma } from "../config/db.js";

// ottenere tutti i topics
const getTopics = async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      include: { user: true },
    });
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// creare un nuovo topic
const createTopic = async (req, res) => {
  try {
    const userId = req.user.id; // Dall'authMiddleware
    const { title, content } = req.body;
    const newTopic = await prisma.topic.create({
      data: {
        title,
        content,
        userId,
      },
      include: { user: true },
    });
    res.status(201).json({ success: true, data: newTopic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getTopics, createTopic };
