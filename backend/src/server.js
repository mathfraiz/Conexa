import app from "./app.js";

const porta = 3000;
const host = "0.0.0.0"

app.listen(porta,host, () => console.log(`Servidor rodando na porta ${porta}`));
