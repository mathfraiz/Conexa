import express from "express";
import cors from "cors";

import routerUsuario from "./rotas/usuario.js";
import routerEvento from "./rotas/evento.js";
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors())
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(routerUsuario);
app.use(routerEvento)


// app.get("/", (req, res) => {
// });

// app.get("/usuarios", (req, res) => {
//   res.json(usuarios);
// });

// app.post("/usuario", (req, res) => {
//   const { nome, email } = req.body;
  
//   if (!nome || !email) {
//     return res.status(400).json({ erro: "Nome e email são obrigatórios" });
//   }

//   const novoUsuario = { id: Date.now(), nome, email };

//   res.status(201).json(novoUsuario);
// });

    

export default app;
