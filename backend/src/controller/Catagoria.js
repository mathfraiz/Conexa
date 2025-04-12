import pool from "../config/bd.js";

class Categoria {
  static async criarCategoria(nome, descricao) {
    try {
      const sql = `INSERT INTO categoria (nome, descricao) VALUES (?, ?)`;
      const [result] = await pool.query(sql, [nome, descricao]);
      return { id: result.insertId, nome, descricao };
    } catch (error) {
      throw new Error("Erro ao criar categoria: " + error.message);
    }
  }

  static async encontrarTodasCategorias() {
    try {
      const sql = `SELECT * FROM categoria`;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar categorias: " + error.message);
    }
  }

  static async atualizarCategoria(id, campos) {
    try {
      const sql = `UPDATE categoria SET ? WHERE id = ?`;
      const [result] = await pool.query(sql, [campos, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao atualizar categoria: " + error.message);
    }
  }

  static async deletarCategoria(id) {
    try {
      const sql = `DELETE FROM categoria WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao deletar categoria: " + error.message);
    }
  }
}

export default Categoria;
