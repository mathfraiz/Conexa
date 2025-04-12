import pool from "../config/bd.js";

class Avaliacao {
  static async criarAvaliacao(usuario_id, evento_id, nota, comentario) {
    try {
      const sql = `INSERT INTO avaliacao (usuario_id, evento_id, nota, comentario) VALUES (?, ?, ?, ?)`;
      const [result] = await pool.query(sql, [
        usuario_id,
        evento_id,
        nota,
        comentario,
      ]);
      return { id: result.insertId, usuario_id, evento_id, nota, comentario };
    } catch (error) {
      throw new Error("Erro ao criar avaliação: " + error.message);
    }
  }

  static async encontrarTodasAvaliacoes() {
    try {
      const sql = `SELECT * FROM avaliacao`;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar avaliações: " + error.message);
    }
  }

  static async atualizarAvaliacao(id, campos) {
    try {
      const sql = `UPDATE avaliacao SET ? WHERE id = ?`;
      const [result] = await pool.query(sql, [campos, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao atualizar avaliação: " + error.message);
    }
  }

  static async deletarAvaliacao(id) {
    try {
      const sql = `DELETE FROM avaliacao WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao deletar avaliação: " + error.message);
    }
  }
}

export default Avaliacao;
