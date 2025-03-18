import pool from "../config/bd";

class Categoria {

    static async createEvento(titulo, descricao, data, horario, local, organizador_id, capacidade_maxima, categoria_id) {
        const sql = `INSERT INTO events (titulo, descricao, data, horario, local, organizador_id, capacidade_maxima, categoria_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [titulo, descricao, data, horario, local, organizador_id, capacidade_maxima, categoria_id]);
        return result.insertId;
    }

    static async findAllEvento() {
        const sql = `SELECT e.*, u.nome AS organizador, c.nome AS categoria 
                        FROM events e
                        JOIN users u ON e.organizador_id = u.id
                        LEFT JOIN categories c ON e.categoria_id = c.id`;
        const [rows] = await pool.query(sql);
        return rows;
    }

    static async findEventoById(id) {
        const sql = `SELECT * FROM events WHERE id = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }
}
