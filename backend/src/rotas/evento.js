import express from "express";
import Evento from "../controller/Evento.js";
import upload from "../config/multer.js";

const routerEvento = express.Router();

// GET /eventos
routerEvento.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.findAllEvento();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar todos os eventos", detalhes: err.message });
  }
});

// GET /evento/:id
routerEvento.get("/evento/:id", async (req, res) => {
  try {
    const evento = await Evento.findEventoById(req.params.id);
    res.json(evento);
  } catch (err) {
    res.status(500).json({ erro: `Erro ao buscar evento com ID ${req.params.id}`, detalhes: err.message });
  }
});

// GET /eventos/eventosMaisAvaliados
routerEvento.get("/eventos/eventosMaisAvaliados", async (req, res) => {
  try {
    const eventosMaisAvaliados = await Evento.encontrarTopEventos();
    res.json(eventosMaisAvaliados);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar eventos mais avaliados", detalhes: err.message });
  }
});

routerEvento.post("/evento", upload.single("imagem"), async (req, res) => {
  try {
    const img = req.file?.buffer;

const evento = {
  nome: req.body.nome,
  tema: req.body.tema,
  data: req.body.data,
  hora: req.body.hora,
  descricao: req.body.descricao,
  imagem_evento: img,
  criado_por: parseInt(req.body.criado_por),
};

const endereco = {
  cep: req.body.cep,
  logradouro: req.body.logradouro,
  bairro: req.body.bairro,
  numero: req.body.numero,
  cidade: req.body.cidade,
  UF: req.body.UF,
};
    // console.log(req.body)
    console.log(evento)
    console.log(endereco)


    // const evento = {
    //   nome: dados.nome,
    //   tema: dados.tema,
    //   data: dados.data,
    //   hora: dados.hora,
    //   descricao: dados.descricao,
    //   imagem_evento: req.file?.buffer || null, // imagem como buffer (longblob)
    //   categoria: parseInt(dados.categoria), // caso esteja enviando id da categoria
    //   criado_por: parseInt(dados.criado_por),
    // };

    // const endereco = {
    //   cep: dados.cep,
    //   logradouro: dados.logradouro,
    //   bairro: dados.bairro,
    //   numero: dados.numero,
    //   cidade: dados.cidade,
    //   UF: dados.UF,
    // };

    const idEvento = await Evento.criarEventoComEndereco(evento, endereco);
    console.log(idEvento + " log na rota")

    res.status(200).json({ status: 200, idEvento });
  } catch (err) {
    res.status(500).json({ erro: "Não foi possível criar o evento", detalhes: err.message });
  }
});

export default routerEvento;
