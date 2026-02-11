import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: false, // Permette cross-origin su localhost
    secure: false, // Richiesto per localhost senza HTTPS
    path: "/",
  });
  return token;
};
