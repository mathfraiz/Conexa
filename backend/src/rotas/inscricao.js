import express from "express";
import Inscricao from "../controller/inscricao.js";
import authenticate from "../middleware/authMiddleware.js";

const routerInscricao = express.Router();

// GET todas as inscrições
routerInscricao.get("/inscricao", async (req, res) => {
  try {
    const inscricoes = await Inscricao.encontrarTodasInscricoes();
    res.json(inscricoes);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar inscrições", detalhes: err.message });
  }
});

// POST criar inscrição
routerInscricao.post("/inscricao", authenticate, async (req, res) => {
  const { usuario_id, evento_id } = req.body;
  if (req.userId !== usuario_id) {
    return res.status(403).json({ erro: "Acesso negado." });
  }
  try {
    const novaInscricao = await Inscricao.criarInscricao(usuario_id, evento_id);
    res.json(novaInscricao);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao criar inscrição", detalhes: err.message });
  }
});

// DELETE remover inscrição
routerInscricao.delete("/inscricao/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await Inscricao.deletarInscricao(id);
    res.json(resultado);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao deletar inscrição", detalhes: err.message });
  }
});

routerInscricao.get("/inscricoesUsuario/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const inscricoes = await Inscricao.encontrarInscricaoPorUsuario(userId);
    console.log(inscricoes);
    res.json(inscricoes);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar inscrições do usuário",
      detalhes: err.message,
    });
  }
});

export default routerInscricao;
