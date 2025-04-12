import express from "express";
import Evento from "../controller/Evento.js";

const routerEvento = express.Router();

// GET /usuarios
routerEvento.get("/eventos", async (req,res)=>{
    try{
        const eventos = await Evento.findAllEvento()
        res.json(eventos)
        
    }
    catch{
        res.status(500).json({erro:"erro ao buscar todos os eventos"})
    }
}
 );

// GET /usuarios/:email
routerEvento.get("/evento/:id",async (req,res)=>{
    try{
        const evento = await Evento.findEventoById(req.params.id)
        res.json(evento)
    }
    catch{
        res.status(500).json({erro:`erro ao buscar o evento de id: ${req.params.id
        }`})
    }
});

// POST /usuarios
routerEvento.post("/evento",async (req,res) =>{
    const evento = req.body
    try{
        const eventoCadastrado = await Evento.createEvento(evento)
        res.json(eventoCadastrado)
    }
    catch{
        res.status(500).json({ erro: "Erro ao criar evento", detalhes: err.message })
    }
} );

routerEvento.get("/eventos/eventosMaisAvaliados",async (req,res) =>{
    try{
        const eventosMaisAvaliados = await Evento.encontrarTopEventos()
        console.log(eventosMaisAvaliados)
        res.json(eventosMaisAvaliados)
    }
    catch{
        res.json({ erro: "Erro ao buscar eventos mais avaliados", detalhes: err.message })
    }
}
);

// PUT /usuarios/:id
// router.put("evento/:id", async (req,res) =>{
//     try{
//         const idUsuario = req.params.id
//         const novoBody = req.body
//         const usuarioAtualizado = await Usuario.atualizarUsuario(idUsuario,novoBody)
//         res.json(usuarioAtualizado)
//     }catch{
//         res.status(500).json({erro:"nao foi possivel atualizar o usuario"})
//     }
// });

// DELETE /usuarios/:id
// router.delete("/:id", async (req,res)=>{
//     try{
//         const idEvento = req.params.id
//         const eventoDeletado = Evento.deletarEvento(idEvento)
//         res.json(eventoDeletado)
    
//     }catch{
//         res.status(500).json({erro:"nao foi possivel deletar o usuario"})
//     }
// });

export default routerEvento;
