import pool from "../config/bd.js";


class Usuario {

  static async criarUsuario(nome, email, senha, telefone, tipo = "participante") {
    try {
      const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo) VALUES (?, ?, ?, ?, ?)`;
      const [resultados] = await pool.query(sql, [nome, email, senha, telefone, tipo]);
      return resultados;
    } catch (error) {
      console.log("erro no controler")
      throw new Error("Erro ao criar usuário: " + error.message);
    }
  }
  
  static async encontrarPorEmail(email) {
    try {
      const sql = `SELECT * FROM usuario WHERE email = ?`;
      const [rows] = await pool.query(sql, [email]);
      return rows[0];
    } catch (error) {
      throw new Error("Erro ao buscar usuário por email: " + error.message);
    }
  }

  static async encontrarTodos() {
    try {
      const sql = `SELECT * FROM usuario`;
      console.log("tentando acessar usuarios")
      const [rows] = await pool.query(sql)
      console.log("usuarios encontrados")
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar todos os usuários: " + error.message);
    }
  }

  static async atualizarUsuario(id, campos) {
    try {
      const sql = `UPDATE usuario SET ? WHERE id = ?`;
      const [result] = await pool.query(sql, [campos, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao atualizar usuário: " + error.message);
    }
  }

  static async deletarUsuario(id) {
    try {
      const sql = `DELETE FROM usuario WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao deletar usuário: " + error.message);
    }
  }

  static async login({email, senha}) {
    try {
      const sql = `SELECT * FROM usuario WHERE email = ? AND senha = ?`;
      const [rows] = await pool.query(sql, [email, senha]);
      return rows[0];
    } catch (error) {
      throw new Error("Erro ao fazer login: " + error.message);
    }
  }
}

export default Usuario;
