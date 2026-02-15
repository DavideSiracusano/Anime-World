import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

interface DecodedToken {
  id: number;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "nessun token, fai il login" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "",
    ) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token non valido" });
  }
};
