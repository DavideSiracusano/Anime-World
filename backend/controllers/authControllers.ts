import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateToken } from "../utils/generateToken";

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const signup = async (
  req: Request<{}, {}, SignupBody>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    const token = generateToken(user, res);

    res.status(201).json({
      success: true,
      message: "User created",
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    res.status(500).json({ error: error.message });
  }
};

const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = generateToken(user, res);

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ authenticated: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { signup, login, logout, getMe };
