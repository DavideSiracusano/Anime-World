import { prisma } from "../config/db";
const getTopics = async (req, res) => {
    try {
        const topics = await prisma.topic.findMany({
            include: { user: true },
        });
        res.status(200).json({ success: true, data: topics });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createTopic = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export { getTopics, createTopic };
