import pool from "../config/bd.js";

class Avaliacao {
  static async criarAtualizarAvaliacao(usuario_id, evento_id, nota) {
    try {
      const sql = `CALL inserir_ou_atualizar_avaliacao(?, ?, ?)`;

      const [result] = await pool.query(sql, [usuario_id, evento_id, nota]);
      return { id: result.insertId, usuario_id, evento_id, nota };
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

  static async encontrarAvaliacoesEventoUsuario(idEvento, idUsuario) {
    try {
      const sql = `SELECT * FROM avaliacao WHERE evento_id = ? AND usuario_id = ?`;
      const [rows] = await pool.query(sql, [idEvento, idUsuario]);
      console.log(rows);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar avaliação: " + error.message);
    }
  }

  // static async atualizarAvaliacao(id, nota) {
  //   try {
  //     const sql = `UPDATE avaliacao SET nota = ? WHERE id = ?`;
  //     const [result] = await pool.query(sql, [nota, id]);
  //     return result.affectedRows;
  //   } catch (error) {
  //     throw new Error("Erro ao atualizar avaliação: " + error.message);
  //   }
  // }

  static async deletarAvaliacao(id) {
    try {
      const sql = `DELETE FROM avaliacao WHERE id = ?`;
      const [result] = await pool.query(sql, [id, id_user]);
      return result.affectedRows;
    } catch (error) {
      throw new Error("Erro ao deletar avaliação: " + error.message);
    }
  }
}

export default Avaliacao;
