import express from "express";
import Evento from "../controller/Evento.js";
import upload from "../config/multer.js";
import authenticate from "../middleware/authMiddleware.js";

const routerEvento = express.Router();

// GET /eventos
routerEvento.get("/eventos", async (req, res) => {
  console.log("entrou no get eventos")
  try {
    const eventos = await Evento.findAllEvento();
    res.json(eventos);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar todos os eventos", detalhes: err.message });
  }
});

// GET /evento/:id
routerEvento.get("/evento/:id", async (req, res) => {
    console.log("entrou no get eventos por id")

  try {
    const evento = await Evento.findEventoById(req.params.id);
    res.json(evento);
  } catch (err) {
    res.status(500).json({
      erro: `Erro ao buscar evento com ID ${req.params.id}`,
      detalhes: err.message,
    });
  }
});

// GET /eventos/eventosMaisAvaliados
routerEvento.get("/eventos/eventosMaisAvaliados", async (req, res) => {
  console.log("entrou no get mais avaliados")
  try {
    const eventosMaisAvaliados = await Evento.encontrarTopEventos();
    res.json(eventosMaisAvaliados);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar eventos mais avaliados",
      detalhes: err.message,
    });
  }
});

routerEvento.post(
  "/evento",
  authenticate,
  upload.single("imagem"),
  async (req, res) => {
    console.log("entrou no post evento")
    try {
      const img = req.file?.buffer;

      const evento = {
        nome: req.body.nome,
        tema: req.body.tema,
        data: req.body.data,
        hora: req.body.hora,
        descricao: req.body.descricao,
        imagem_evento: req.file?.buffer || null,
        criado_por: req.userId,
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

      res.status(200).json({ status: 200, idEvento });
    } catch (err) {
      res.status(500).json({
        erro: "Não foi possível criar o evento",
        detalhes: err.message,
      });
    }
  }
);

routerEvento.delete("/eventos/:id", authenticate, async (req, res) => {
  console.log("entrou no delete evento")
  try {
    const id = req.params.id;

    // Busca o evento no banco
    const evento = await Evento.findEventoById(id);

    if (!evento) {
      return res.status(404).json({ erro: "Evento não encontrado" });
    }

    // Protege: só o criador ou admin pode deletar
    if (evento.criado_por !== req.userId && req.userTipo !== "admin") {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const eventoDeletado = await Evento.deletarEvento(id);

    res
      .status(200)
      .json({ status: 200, mensagem: "Evento deletado com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao deletar evento", detalhes: err.message });
  }
});

routerEvento.get("/eventos/usuario/:id", authenticate, async (req, res) => {
  console.log("entrou no get eventos de usuario especifico")
  try {
    const id = parseInt(req.params.id);

    // Proteção: só o próprio usuário ou um admin pode ver os eventos
    if (req.userId !== id) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const eventos = await Evento.buscarEventosPorUsuario(id);
    res.json(eventos);
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao buscar eventos do usuário",
      detalhes: err.message,
    });
  }
});

routerEvento.put(
  "/evento/:id",
  authenticate,
  upload.single("imagem"),
  async (req, res) => {
    const eventoId = parseInt(req.params.id);
    const { nome, descricao, descricao_completa, data, hora } = req.body;
    const imagem = req.file?.buffer || null;
 
    try {
      console.log("entrou no put eventos por id")
      // Busca o evento atual para verificar se o usuário tem permissão
      const eventoAtual = await Evento.findEventoById(eventoId);
      if (!eventoAtual) {
        return res.status(404).json({ erro: "Evento não encontrado" });
      }

      // Somente o criador ou um admin pode editar
      if (req.userId !== eventoAtual.criado_por && req.userTipo !== "admin") {
        return res
          .status(403)
          .json({ erro: "Você não tem permissão para editar este evento" });
      }

      const atualizado = await Evento.atualizarEvento(
        eventoId,
        nome,
        descricao,
        descricao_completa,
        data,
        hora,
        imagem
      );

      if (atualizado) {
        res.status(200).json({ sucesso: true, eventoAtualizado: eventoId });
      } else {
        res.status(400).json({ erro: "Não foi possível atualizar o evento" });
      }
    } catch (error) {
      console.error("Erro ao atualizar evento:", error.message);
      res.status(500).json({ erro: "Erro interno", detalhes: error.message });
    }
  }
);
// EXPORTAR EVENTOS
routerEvento.get("/evento/exportar", authenticate, async (req, res) => {
  console.log("entrou no evento/exportar")
  try {
    if (req.userTipo !== "admin") {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const eventos = await Evento.findAllEvento(); // ou Evento.encontrarTodos() se você tiver esse nome
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=eventos.json");
    res.status(200).send(JSON.stringify(eventos, null, 2));
  } catch (err) {
    res.status(500).json({ erro: "Erro ao exportar eventos", detalhes: err.message });
  }
});


export default routerEvento;
