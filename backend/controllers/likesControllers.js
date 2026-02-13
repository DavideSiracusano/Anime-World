import { prisma } from "../config/db.js";

// Ottenere il numero di like per un topic
const getLikes = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const likeCount = await prisma.like.count({
      where: { topicId },
    });
    res.json({ likeCount });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei like" });
  }
};

// Aggiungere un like a un topic (o togglare se esiste)
const addLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicId = parseInt(req.params.topicId);

    // Controlla se il like esiste già
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });

    if (existingLike) {
      // Se esiste, lo elimina
      await prisma.like.deleteMany({
        where: {
          AND: [{ userId }, { topicId }],
        },
      });
      res.json({ success: true, action: "removed" });
    } else {
      // Se non esiste, lo crea
      const like = await prisma.like.create({
        data: {
          userId,
          topicId,
        },
      });
      res.json({ success: true, action: "added", data: like });
    }
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiunta del like" });
  }
};

// Rimuovere un like da un topic
const removeLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicId = parseInt(req.params.topicId);
    const like = await prisma.like.delete({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });
    res.json({ success: true, data: like });
  } catch (error) {
    res.status(500).json({ error: "Errore nel rimozione del like" });
  }
};

// Verificare se l'utente ha messo like a un topic
const checkUserLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicId = parseInt(req.params.topicId);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });

    res.json({ liked: !!existingLike });
  } catch (error) {
    res.status(500).json({ error: "Errore nel controllo del like" });
  }
};

export { getLikes, addLike, removeLike, checkUserLike };
