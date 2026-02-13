import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "nessun token, fai il login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Salva l'intero oggetto user nel request
    next();
  } catch (error) {
    res.status(401).json({ error: "Token non valido" });
  }
};
