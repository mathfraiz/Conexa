import pool from "../config/bd.js";

class Registration {
  static async create(usuario_id, evento_id, status = "pendente") {
    const sql = `INSERT INTO registrations (usuario_id, evento_id, status) VALUES (?, ?, ?)`;
    const result = await pool.query(sql, [usuario_id, evento_id, status]);
    return result.insertId;
  }

  static async findByUser(usuario_id) {
    const sql = `SELECT r.*, e.titulo AS evento, e.data 
                 FROM registrations r
                 JOIN events e ON r.evento_id = e.id
                 WHERE r.usuario_id = ?`;
    const rows= await pool.query(sql, [usuario_id]);
    return rows;
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE registrations SET status = ? WHERE id = ?`;
    await pool.query(sql, [status, id]);
  }
}   

export default Registration;
