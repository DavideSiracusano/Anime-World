import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction, // true in production, false in development
  });
  return token;
};
