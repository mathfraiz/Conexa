import express from "express";
import Endereco from "../controller/Endereco.js";
import upload from "../config/multer.js";

const routerEndereco = express.Router();

routerEndereco.get("/endereco/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const endereco = await Endereco.findPorId(id);
    res.json(endereco);
  } catch (err) {
    res
      .status(500)
      .json({
        erro: "Erro ao buscar todos os endereços",
        detalhes: err.message,
      });
  }
});

export default routerEndereco;
