import { prisma } from "../config/db.js";

// Ottenere tutti i favoriti dell'utente loggato
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // Dall'authMiddleware

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggiungere un anime ai preferiti
const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mal_id, title, image } = req.body;

    if (!mal_id || !title || !image) {
      return res.status(400).json({
        error: "mal_id, title, and image are required",
      });
    }

    // Verificare se è già nei favoriti
    const existing = await prisma.favorite.findFirst({
      where: { userId, mal_id },
    });

    if (existing) {
      return res.status(409).json({
        error: "Questo anime è già nei tuoi preferiti",
      });
    }

    // Aggiungere ai favoriti
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rimuovere un anime dai preferiti
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mal_id } = req.params;

    const favorite = await prisma.favorite.findFirst({
      where: { userId, mal_id: parseInt(mal_id) },
    });

    if (!favorite) {
      return res.status(404).json({
        error: "Anime non trovato nei tuoi preferiti",
      });
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    res.status(200).json({ success: true, message: "Rimosso dai preferiti" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controllare se un anime è nei preferiti
const isFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mal_id } = req.params;

    const favorite = await prisma.favorite.findFirst({
      where: { userId, mal_id: parseInt(mal_id) },
    });

    res.status(200).json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getFavorites, addFavorite, removeFavorite, isFavorite };
