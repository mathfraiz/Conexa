import express from "express";
import Avaliacao from "../controller/avaliacao.js";

const routerAvaliacao = express.Router();

// GET todas as avaliações
routerAvaliacao.get("/avaliacao", async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.encontrarTodasAvaliacoes();
    res.json(avaliacoes);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar avaliações", detalhes: err.message });
  }
});

// POST criar avaliação
routerAvaliacao.post("/avaliacao", async (req, res) => {
  const { usuario_id, evento_id, nota, comentario } = req.body;
  try {
    const novaAvaliacao = await Avaliacao.criarAvaliacao(usuario_id, evento_id, nota, comentario);
    res.json(novaAvaliacao);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar avaliação", detalhes: err.message });
  }
});

// PUT atualizar avaliação
routerAvaliacao.put("/avaliacao/:id", async (req, res) => {
  const id = req.params.id;
  const campos = req.body;
  try {
    const avaliacaoAtualizada = await Avaliacao.atualizarAvaliacao(id, campos);
    res.json(avaliacaoAtualizada);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar avaliação", detalhes: err.message });
  }
});

// DELETE remover avaliação
routerAvaliacao.delete("/avaliacao/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await Avaliacao.deletarAvaliacao(id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar avaliação", detalhes: err.message });
  }
});

export default routerAvaliacao;
