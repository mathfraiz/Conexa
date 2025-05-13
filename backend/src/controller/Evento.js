import pool from "../config/bd.js";

const Evento = {
  async findAllEvento() {
    const [rows] = await pool.query("SELECT * FROM eventos");

    const eventosConvertidos = rows.map((evento) => ({
      ...evento,
      imagem_evento: evento.imagem_evento
        ? `data:image/jpeg;base64,${evento.imagem_evento.toString("base64")}`
        : null,
    }));

    return eventosConvertidos;
  },

  async findEventoById(id) {
    const [rows] = await pool.query("SELECT * FROM eventos WHERE id = ?", [id]);

    const evento = rows[0];

    if (evento?.imagem_evento) {
      evento.imagem_evento = `data:image/jpeg;base64,${evento.imagem_evento.toString(
        "base64"
      )}`;
    }

    return evento;
  },
  async deletarEvento(id) {
    const [rows] = await pool.query("DELETE FROM eventos WHERE id = ?", [id]);
    return rows;
  },
  async encontrarTopEventos() {
    const [rows] = await pool.query(`
      SELECT * FROM eventos
      ORDER BY avaliacao_media DESC 
      LIMIT 5
    `);
    return rows;
  },

  async criarEventoComEndereco(evento, endereco) {
    const conn = await pool.getConnection(); // se estiver usando pool

    try {
      await conn.beginTransaction();

      // 1. Cadastrar endereço
      const [resEndereco] = await conn.query(
        `INSERT INTO endereco (logradouro, numero, bairro, cep, cidade, UF)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          endereco.logradouro,
          endereco.numero,
          endereco.bairro,
          endereco.cep,
          endereco.cidade,
          endereco.UF,
        ]
      );

      const enderecoId = resEndereco.insertId;
      console.log(enderecoId);
      // 2. Cadastrar evento com ID do endereço
      console.log("no controller ");
      console.log(evento);
      const [resEvento] = await conn.query(
        `INSERT INTO eventos
          (nome, descricao, descricao_completa, data, hora, imagem_evento ,criado_por, endereco_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          evento.nome,
          evento.tema,
          evento.descricao, // você pode mudar se for usar campo diferente para descrição completa
          evento.data,
          evento.hora,
          evento.imagem_evento,
          evento.criado_por,
          enderecoId,
        ]
      );

      const eventoId = resEvento.insertId;

      await conn.commit();
      console.log(eventoId + " log no controller");
      return eventoId;
    } catch (err) {
      console.log("erro no transaction");
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

export default Evento;
