const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const db = require('./model/db');

// Servir ficheiros estáticos (como o HTML)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Definir uma rota GET
app.get('/api/mensagem', (req, res) => {
  res.json({ mensagem: 'Olá, esta é a resposta da rota!' });
});

// apos isso são os apps do projeto