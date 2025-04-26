import express from "express";
import Usuario from "../controller/Usuario.js";
import upload from "../config/multer.js";

const routerUsuario = express.Router();

// GET /usuarios
routerUsuario.get("/usuario", async (req, res) => {
  try {
    const usuarios = await Usuario.encontrarTodos();
    res.json(usuarios);
  } catch {
    res.status(500).json({ erro: "erro ao buscar todos os usuarios" });
  }
});

// POST /usuarios
routerUsuario.post(
  "/usuario",
  upload.single("imagem_perfil"),
  async (req, res) => {
    try {
      const { nome, email, senha, telefone, tipo } = req.body;
      console.log("Novo cadastro:", { nome, email, telefone, tipo });
      console.log("arquivo:", req.file);

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
  const usuario = req.body;
  try {
    const usuarioLogado = await Usuario.login(usuario);
    if (!!!usuarioLogado) {
      res.status(401).json({ erro: "Email ou senha inválidos" });
      return;
    } else {
      if (usuarioLogado.imagem_perfil) {
        usuarioLogado.imagem_perfil = `data:image/jpeg;base64,${usuarioLogado.imagem_perfil.toString(
          "base64"
        )}`;
      }

      res.status(200).json(usuarioLogado);
    }
  } catch {
    res
      .status(500)
      .json({ erro: "Erro ao fazer login", detalhes: err.message });
  }
});

// PUT /usuarios/:id
routerUsuario.put(
  "/usuario/:id",
  upload.single("imagem_perfil"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { nome, email, senha, telefone, tipo } = req.body;
      const imagem = req.file?.buffer || null;

      const usuarioAtualizado = await Usuario.atualizarUsuario(
        id,
        nome,
        email,
        senha,
        telefone,
        tipo,
        imagem
      );
      res.json({ sucesso: true, atualizado: usuarioAtualizado });
    } catch (error) {
      console.log("Erro na rota PUT:", error);
      res.status(500).json({ erro: "Não foi possível atualizar o usuário" });
    }
  }
);

// DELETE /usuarios/:id
routerUsuario.delete("/usuario/:id", async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const usuarioDeletado = Usuario.deletarUsuario(idUsuario);
    res.json(usuarioDeletado);
  } catch {
    res.status(500).json({ erro: "nao foi possivel deletar o usuario" });
  }
});

export default routerUsuario;
