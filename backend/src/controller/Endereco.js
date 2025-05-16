import pool from "../config/bd.js";

const Endereco = {
  async findPorId(id) {
    try {
      const sql = `SELECT * FROM endereco WHERE id = ?`;
      const [rows] = await pool.query(sql, [id]);
      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (Err) {
      return res.status(500).json({
        erro: "Erro ao buscar todos os endereços",
        detalhes: err.message,
      });
    }
  },
};

export default Endereco;
