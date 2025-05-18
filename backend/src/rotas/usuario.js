import express from "express";
import Usuario from "../controller/Usuario.js";
import upload from "../config/multer.js";
import { generateToken } from "../config/auth.js"; // importa o JWT
import authenticate from "../middleware/authMiddleware.js";

const routerUsuario = express.Router();

// GET /usuarios
routerUsuario.get("/usuario", async (req, res) => {
  console.log("entrou no get usuarios");
  try {
    const usuarios = await Usuario.encontrarTodos();
    res.json(usuarios);
  } catch {
    res.status(500).json({ erro: "erro ao buscar todos os usuarios" });
  }
});

routerUsuario.get("/usuario/me", authenticate, async (req, res) => {
  console.log("entrou no get usuario/me");
  try {
    const usuario = await Usuario.encontrarUsuarioPorId(req.userId);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (usuario.imagem_perfil) {
      usuario.imagem_perfil = `data:image/jpeg;base64,${usuario.imagem_perfil.toString(
        "base64"
      )}`;
    }

    res.status(200).json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar dados do usuário", detalhes: err.message });
  }
});

// POST /usuarios
routerUsuario.post(
  "/usuario",
  upload.single("imagem_perfil"),
  async (req, res) => {
    try {
      console.log("entrou no post usuario");
      const { nome, email, senha, telefone, tipo } = req.body;
      const foto = req.file?.buffer || null;

      const usuarioCadastrado = await Usuario.criarUsuario(
        nome,
        email,
        senha,
        telefone,
        tipo,
        foto
      );

      if (!usuarioCadastrado) {
        return res.status(400).json({ erro: "Erro ao criar usuário" });
      }

      console.log("Usuário cadastrado:", usuarioCadastrado);
      res.status(200).json(usuarioCadastrado);
    } catch (err) {
      console.error("Erro na rota de cadastro:", err);
      res
        .status(500)
        .json({ erro: "Erro ao criar usuário", detalhes: err.message });
    }
  }
);

routerUsuario.post("/login", async (req, res) => {
  console.log("entrou nop /login");
  const usuario = req.body;

  try {
    const usuarioLogado = await Usuario.login(usuario);

    if (!usuarioLogado) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    if (usuarioLogado.imagem_perfil) {
      usuarioLogado.imagem_perfil = `data:image/jpeg;base64,${usuarioLogado.imagem_perfil.toString(
        "base64"
      )}`;
    }

    const token = generateToken(usuarioLogado.id);

    res.status(200).json({
      token,
      usuario: usuarioLogado,
    });
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao fazer login",
      detalhes: err.message,
    });
  }
});

// PUT /usuarios/:id
routerUsuario.put(
  "/usuario/:id",
  authenticate,
  upload.single("imagem_perfil"),
  async (req, res) => {
    console.log("entrou no put usuario/id");
    const id = parseInt(req.params.id);
    console.log(id);
    console.log(req.userId);

    // Proteção: apenas o próprio usuário OU um admin pode editar
    if (req.userTipo !== "admin" && req.userId !== id) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    try {
      const { nome, email, telefone, senha, senhaNova, tipo } = req.body;
      const imagem = req.file?.buffer || null;

      const usuarioAtualizado = await Usuario.atualizarUsuario(
        id,
        nome,
        email,
        telefone,
        senha,
        senhaNova,
        tipo,
        imagem
      );
      console.log("passou1");
      if (usuarioAtualizado) {
        if (usuarioAtualizado.imagem_perfil)
          usuarioAtualizado.imagem_perfil = `data:image/jpeg;base64,${usuarioAtualizado.imagem_perfil.toString(
            "base64"
          )}`;
      }
      console.log("passou2");

      console.log(usuarioAtualizado);
      res.json(usuarioAtualizado);
    } catch (error) {
      console.log("Erro na rota PUT:", error);
      res.status(500).json({ erro: "Não foi possível atualizar o usuário" });
    }
  }
);

// DELETE /usuarios/:id
routerUsuario.delete("/usuario/:id", authenticate, async (req, res) => {
  console.log("entrou no delete usuario");
  const id = parseInt(req.params.id);

  if (req.userTipo !== "admin" && req.userId !== id) {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  try {
    const usuarioDeletado = await Usuario.deletarUsuario(id);
    res.json({ sucesso: true, deletado: usuarioDeletado });
  } catch (error) {
    console.log("Erro ao deletar:", error.message);
    res.status(500).json({ erro: "Não foi possível deletar o usuário" });
  }
});

routerUsuario.get("/usuario/:id", async (req, res) => {
  console.log("entoru no get usuario/id");
  try {
    const id = req.params.id;
    const usuario = await Usuario.encontrarUsuarioPorId(id);
    if (usuario?.imagem_perfil) {
      usuario.imagem_perfil = `data:image/jpeg;base64,${usuario.imagem_perfil.toString(
        "base64"
      )}`;
    }
    res.json(usuario);
  } catch (error) {
    console.log("Erro ao buscar usuário:", error.message);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});
// EXPORTAR USUÁRIOS
routerUsuario.get("/usuario/exportar", authenticate, async (req, res) => {
  console.log("entrou no usuario/exportar");
  try {
    if (req.userTipo !== "admin") {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const usuarios = await Usuario.encontrarTodos();
    const json = JSON.stringify(usuarios, null, 2);

    res.setHeader("Content-Disposition", "attachment; filename=usuarios.json");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(json);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao exportar usuários", detalhes: err.message });
  }
});

export default routerUsuario;
