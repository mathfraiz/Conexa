// middlewares/authMiddleware.js

import { verifyToken } from "../config/auth.js";
import Usuario from "../controller/Usuario.js";

export default async function authenticate(req, res, next) {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const decoded = verifyToken(token);
  console.log(decoded.id);

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    console.log(decoded.id);

    // Busca o usuário para pegar o tipo
    const usuario = await Usuario.encontrarUsuarioPorId(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.userId = usuario.id;
    req.userTipo = usuario.tipo;
    console.log("Token decodificado:", decoded);
    console.log("userId", req.userId);
    console.log("usuario", usuario);

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
