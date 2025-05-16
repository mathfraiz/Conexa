import pool from "../config/bd.js";

class Inscricao {
  static async criarInscricao(usuario_id, evento_id) {
    try {
      const sql = `INSERT INTO inscricao (usuario_id, evento_id) VALUES (?, ?)`;
      const [result] = await pool.query(sql, [usuario_id, evento_id]);
      return { id: result.insertId, usuario_id, evento_id };
    } catch (error) {
      throw new Error("Erro ao criar inscrição: " + error.message);
    }
  }

  static async encontrarTodasInscricoes() {
    try {
      const sql = `SELECT * FROM inscricao`;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar inscrições: " + error.message);
    }
  }
  static async encontrarInscricaoPorUsuario(usuario_id) {
    try {
      const sql = `SELECT id, usuario_id, evento_id FROM inscricao WHERE usuario_id = ?`;
      const [rows] = await pool.query(sql, [usuario_id]);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar inscrições do usuário: " + error.message);
    }
  }

  static async deletarInscricao(id) {
    try {
      const sql = `DELETE FROM inscricao WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao deletar inscrição: " + error.message);
    }
  }
}

export default Inscricao;


