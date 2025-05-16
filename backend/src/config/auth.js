// config/auth.js (versão ESModules)
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "10s",
  });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // coloca os dados no req
    next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res.status(401).json({ mensagem: "Token expirado" });
    } else {
      return res.status(401).json({ mensagem: "Token inválido" });
    }
  }
};
