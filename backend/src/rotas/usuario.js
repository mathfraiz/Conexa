import express from "express";
import Usuario from "../controller/Usuario.js";

const routerUsuario = express.Router();

// GET /usuarios
routerUsuario.get("/usuario", async (req,res)=>{
    try{
        const usuarios = await Usuario.encontrarTodos()
        res.json(usuarios)   
    }
    catch{
        res.status(500).json({erro:"erro ao buscar todos os usuarios"})
    }
}
 );

// GET /usuarios/:email
routerUsuario.get("/usuario/email",async (req,res)=>{
    const body = req.body
    try{
        const usuario = await Usuario.encontrarPorEmail(body)
        res.json(usuario)
    }
    catch{
        res.status(500).json({erro:`erro ao buscar o usuario de email: ${body}`})
    }
});

// POST /usuarios
routerUsuario.post("/usuario",async (req,res) =>{
    let {nome, email, senha, telefone, tipo} = req.body
    try{
        const usuarioCadastrado = await Usuario.criarUsuario(nome, email, senha, telefone, tipo)
        res.json(usuarioCadastrado)
    }
    catch{
        console.log("erro na rota")
        res.status(500).json({ erro: "Erro ao criar usuário", detalhes: res.message })
    }
} );

routerUsuario.post("/login",async (req,res) =>{
    const usuario = req.body
    try{
        const usuarioLogado = await Usuario.login(usuario)
        res.json(usuarioLogado)
    }
    catch{
        res.status(500).json({ erro: "Erro ao fazer login", detalhes: err.message })
    }
});

// PUT /usuarios/:id
routerUsuario.put("/usuario/:id", async (req,res) =>{
    try{
        const idUsuario = req.params.id
        const novoBody = req.body
        const usuarioAtualizado = await Usuario.atualizarUsuario(idUsuario,novoBody)
        res.json(usuarioAtualizado)
    }catch{
        res.status(500).json({erro:"nao foi possivel atualizar o usuario"})
    }
});

// DELETE /usuarios/:id
routerUsuario.delete("/usuario/:id", async (req,res)=>{
    try{
        const idUsuario = req.params.id
        const usuarioDeletado = Usuario.deletarUsuario(idUsuario)
        res.json(usuarioDeletado)
    
    }catch{
        res.status(500).json({erro:"nao foi possivel deletar o usuario"})
    }
});

export default routerUsuario;
