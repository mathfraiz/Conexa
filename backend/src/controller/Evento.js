import pool from "../config/bd.js";

const Evento = {
  async findAllEvento() {
    const [rows] = await pool.query(
      "SELECT eventos.*, usuario.nome AS nome_usuario, usuario.email AS email_usuario,usuario.telefone AS telefone_usuario FROM eventos JOIN usuario ON eventos.criado_por = usuario.id"
    );

    const eventosConvertidos = rows.map((evento) => ({
      ...evento,
      imagem_evento: evento.imagem_evento
        ? `data:image/jpeg;base64,${evento.imagem_evento.toString("base64")}`
        : null,
    }));
    console

    return eventosConvertidos;
  },

  async findEventoById(id) {
    const [rows] = await pool.query(
      `SELECT eventos.*, usuario.nome AS nome_usuario, usuario.email AS email_usuario FROM eventos JOIN usuario ON eventos.criado_por = usuario.id WHERE eventos.id = ?`,
      [id]
    );

    const evento = rows[0];

    if (evento?.imagem_evento) {
      evento.imagem_evento = `data:image/jpeg;base64,${evento.imagem_evento.toString(
        "base64"
      )}`;
    }

    return evento;
  },

  async atualizarEvento(
    id,
    nome,
    descricao,
    descricao_completa,
    data,
    hora,
    imagem
  ) {
    try {
      let campos = [];
      let valores = [];

      // Campos obrigatórios que sempre atualizamos
      campos.push(
        "nome = ?",
        "descricao = ?",
        "descricao_completa = ?",
        "data = ?",
        "hora = ?"
      );
      valores.push(nome, descricao, descricao_completa, data, hora);

      // Tratar imagem: se for "vazio", limpa (null); se existir, atualiza; se undefined, não altera
      if (imagem === "vazio") {
        campos.push("imagem_evento = ?");
        valores.push(null);
      } else if (imagem) {
        campos.push("imagem_evento = ?");
        valores.push(imagem);
      }

      const sql = `UPDATE eventos SET ${campos.join(", ")} WHERE id = ?`;
      valores.push(id);

      const [result] = await pool.query(sql, valores);

      if (result.affectedRows > 0) {
        // Retorna o evento atualizado
        const [rows] = await pool.query("SELECT * FROM eventos WHERE id = ?", [
          id,
        ]);
        return rows[0];
      }
      return null;
    } catch (err) {
      console.error("Erro no atualizarEvento:", err.message);
      return null;
    }
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
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

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
          evento.descricao,
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

  async buscarEventosPorUsuario(id) {
    const [rows] = await pool.query(
      `SELECT e.*
       FROM eventos e
       JOIN usuario u ON e.criado_por = u.id
       WHERE e.criado_por = ?`,
      [id]
    );
    const eventosConvertidos = rows.map((evento) => ({
      ...evento,
      imagem_evento: evento.imagem_evento
        ? `data:image/jpeg;base64,${evento.imagem_evento.toString("base64")}`
        : null,
    }));

    console.log(eventosConvertidos);

    return eventosConvertidos;
  },
};

export default Evento;
