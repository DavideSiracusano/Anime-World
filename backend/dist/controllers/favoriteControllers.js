import { prisma } from "../config/db";
const getFavorites = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: favorites });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const addFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { mal_id, title, image } = req.body;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (!mal_id || !title || !image) {
            res.status(400).json({
                error: "mal_id, title, and image are required",
            });
            return;
        }
        const existing = await prisma.favorite.findFirst({
            where: { userId, mal_id },
        });
        if (existing) {
            res.status(409).json({
                error: "Questo anime è già nei tuoi preferiti",
            });
            return;
        }
        const favorite = await prisma.favorite.create({
            data: {
                userId,
                mal_id,
                title,
                image,
            },
        });
        res.status(201).json({
            success: true,
            message: "Aggiunto ai preferiti",
            data: favorite,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const removeFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { mal_id } = req.params;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const favorite = await prisma.favorite.findFirst({
            where: { userId, mal_id: parseInt(mal_id) },
        });
        if (!favorite) {
            res.status(404).json({
                error: "Anime non trovato nei tuoi preferiti",
            });
            return;
        }
        await prisma.favorite.delete({
            where: { id: favorite.id },
        });
        res.status(200).json({ success: true, message: "Rimosso dai preferiti" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const isFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { mal_id } = req.params;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const favorite = await prisma.favorite.findFirst({
            where: { userId, mal_id: parseInt(mal_id) },
        });
        res.status(200).json({ success: true, isFavorite: !!favorite });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export { getFavorites, addFavorite, removeFavorite, isFavorite };
