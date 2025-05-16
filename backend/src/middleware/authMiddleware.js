// middlewares/authMiddleware.js

import { verifyToken } from "../config/auth.js";
import Usuario from "../controller/Usuario.js";

export default async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = verifyToken(token);

    // Busca o usuário para pegar o tipo
    const usuario = await Usuario.encontrarUsuarioPorId(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.userId = usuario.id;
    req.userTipo = usuario.tipo;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
