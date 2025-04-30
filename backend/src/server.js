import app from "./app.js"

const porta = 3000;

app.listen(porta, '0.0.0.0', () => console.log(`Servidor rodando na porta http://0.0.0.0:${porta}`));

