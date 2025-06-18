import pool from "../config/bd.js";

class Inscricao {
  static async criarInscricao(usuario_id, evento_id) {
    try {
      const sql = "CALL InserirInscricao(?, ?)";
      console.log("entrou no criarInscricao");

      const [rows] = await pool.query(sql, [usuario_id, evento_id]);
      const resultado = rows[0][0]; // Pega a primeira linha do SELECT
      console.log("resultado", resultado);
      // console.log("rows", rows);
      // console.log(rows[0]);
      return {
        id: resultado.id,
        usuario_id: resultado.usuario_id,
        evento_id: resultado.evento_id,
      };
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
      const sql = `SELECT eventos.* FROM eventos JOIN inscricao ON eventos.id = inscricao.evento_id WHERE inscricao.usuario_id = ?;`;
      const [rows] = await pool.query(sql, [usuario_id]);
      const eventosConvertidos = rows.map((evento) => ({
        ...evento,
        imagem_evento: evento.imagem_evento
          ? `data:image/jpeg;base64,${evento.imagem_evento.toString("base64")}`
          : null,
      }));
      console.log(eventosConvertidos);

      return eventosConvertidos;
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
