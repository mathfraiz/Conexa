import express from "express";
import Categoria from "../controller/Categoria.js";

const routerCategoria = express.Router();

// GET todas as categorias
routerCategoria.get("/categoria", async (req, res) => {
  try {
    const categorias = await Categoria.encontrarTodasCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar categorias", detalhes: err.message });
  }
});

// POST criar categoria
routerCategoria.post("/categoria", async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    const novaCategoria = await Categoria.criarCategoria(nome, descricao);
    res.json(novaCategoria);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar categoria", detalhes: err.message });
  }
});

// PUT atualizar categoria
routerCategoria.put("/categoria/:id", async (req, res) => {
  const id = req.params.id;
  const campos = req.body;
  try {
    const categoriaAtualizada = await Categoria.atualizarCategoria(id, campos);
    res.json(categoriaAtualizada);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar categoria", detalhes: err.message });
  }
});

// DELETE remover categoria
routerCategoria.delete("/categoria/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await Categoria.deletarCategoria(id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar categoria", detalhes: err.message });
  }
});

export default routerCategoria;
