import { prisma } from "../config/db";
const getComments = async (req, res) => {
    try {
        const topicId = parseInt(req.params.topicId);
        const comments = await prisma.comment.findMany({
            where: { topicId },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: comments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createComment = async (req, res) => {
    const { topicId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    try {
        if (!content || !content.trim()) {
            res.status(400).json({ error: "Content is required" });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                topicId: parseInt(topicId),
                userId,
            },
            include: { user: true },
        });
        res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export { getComments, createComment };
