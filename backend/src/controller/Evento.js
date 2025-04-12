import pool from "../config/bd.js";

class Evento {
  static async createEvento({
    nome,
    descricao,
    descricao_completa,
    data,
    hora,
    localizacao,
    categoria,
    criado_por,
  }) {
    const sql = `
      INSERT INTO eventos (nome, descricao, descricao_completa, data, hora, localizacao, categoria, criado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      nome,
      descricao,
      descricao_completa,
      data,
      hora,
      localizacao,
      categoria,
      criado_por,
    ]);

    return result.insertId;
  }

  static async findAllEvento() {
    const sql = `SELECT * FROM eventos`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async findEventoById(id) {
    const sql = `SELECT * FROM eventos WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  }
  static async deletarEvento(id) {
    const sql = `DELETE FROM eventos WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows;
  }

  static async atualizarEvento(id, campos) {
    try {
      const keys = Object.keys(campos);
      const values = Object.values(campos);

      if (keys.length === 0) {
        throw new Error("Nenhum campo fornecido para atualização.");
      }

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const sql = `UPDATE eventos SET ${setClause} WHERE id = ?`;

      const [result] = await pool.query(sql, [...values, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao atualizar evento: " + error.message);
    }
  }

  static async encontrarTopEventos() {
    try {
      const sql = `SELECT * FROM eventos ORDER BY avaliacao_media DESC LIMIT 3`;
      const [rows] = await pool.query(sql);
      console.log(rows);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar top eventos: " + error.message);
    }
  }
}

export default Evento;
