// Import della libreria bcrypt per hashare le password
import bcrypt from "bcrypt";
// Import dell'istanza Prisma per interagire con il database
import { prisma } from "../config/db.js";

//import funzione per generare token JWT
import { generateToken } from "../utils/generateToken.js";

//funzione per gestire signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    // Verificare se l'utente esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hashare la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creare l'utente nel database
    const user = await prisma.user.create({
      data: {
        name: name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Generare il token JWT
    const token = generateToken(user, res);

    res.status(201).json({
      success: true,
      message: "User created",
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      return res.status(409).json({ error: "Email already in use" });
    }

    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Trovare l'utente nel database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Confrontare la password hashata
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generare il token JWT
    const token = generateToken(user, res);

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ authenticated: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { signup, login, logout, getMe };
