import pool from "../config/bd.js";

class Usuario {
  static async create(nome, email, senha, telefone, tipo = "participante") {
    const sql = `INSERT INTO users (nome, email, senha, telefone, tipo) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [nome, email, senha, telefone, tipo]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.query(sql, email);
    return rows[0];
  }

  static async findAll() {
    const sql = `SELECT * FROM users`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async updateUsuario(campos ,valores, id){

      const sql = `UPDATE users set ? = ? where id = ?`
      const [rows] = await pool.query(sql)
  }

  static async deleteUsuario(id){
    const sql = `DELETE FROM users WHERE id = ?`
    const [result] = await pool.query(sql,id) 
    return result[0]
  }
}

export default Usuario;
