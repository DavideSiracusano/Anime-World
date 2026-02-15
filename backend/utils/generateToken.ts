import jwt from "jsonwebtoken";
import type { Response } from "express";

interface User {
  id: number;
  [key: string]: any;
}

export const generateToken = (user: User, res: Response): string => {
  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  return token;
};
