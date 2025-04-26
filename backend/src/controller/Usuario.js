import pool from "../config/bd.js";

class Usuario {
  static async criarUsuario(
    nome,
    email,
    senha,
    telefone,
    tipo = "usuario",
    foto
  ) {
    try {
      const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo,imagem_perfil) VALUES (?, ?, ?, ?, ?,?)`;
      const [resultados] = await pool.query(sql, [
        nome,
        email,
        senha,
        telefone,
        tipo,
        foto,
      ]);
      console.log(resultados);
      console.log(resultados.affectedRows);
      if (resultados.affectedRows == 0) {
        return null;
      }
      return resultados;
    } catch (error) {
      console.log("erro no controler " + error);
      return 0;
    }
  }

  static async encontrarPorEmail(email) {
    try {
      const sql = `SELECT * FROM usuario WHERE email = ?`;
      const [rows] = await pool.query(sql, [email]);
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  static async encontrarTodos() {
    try {
      const sql = `SELECT * FROM usuario`;
      console.log("tentando acessar usuarios");
      const [rows] = await pool.query(sql);

      // Converte imagem_perfil de Buffer para base64
      const usuariosConvertidos = rows.map((user) => ({
        ...user,
        imagem_perfil: user.imagem_perfil
          ? user.imagem_perfil.toString("base64")
          : null,
      }));

      console.log("usuarios encontrados");
      return usuariosConvertidos;
    } catch (error) {
      console.log("Erro ao buscar todos os usuários: " + error.message);
      return [];
    }
  }

  static async atualizarUsuario(id, nome, email, senha, telefone, tipo, foto) {
    try {
      const sql = `
        UPDATE usuario SET nome = ?, email = ?, senha = ?, telefone = ?, tipo = ?, imagem_perfil = ?
        WHERE id = ?
      `;
      const [result] = await pool.query(sql, [
        nome,
        email,
        senha,
        telefone,
        tipo,
        foto,
        id,
      ]);
      return result.affectedRows;
    } catch (error) {
      console.log("Erro ao atualizar usuário: " + error.message);
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

  static async login({ email, senha }) {
    try {
      const sql = `SELECT * FROM usuario WHERE email = ? AND senha = ?`;
      const [rows] = await pool.query(sql, [email, senha]);
      if (rows.length === 0) {
        return null; // Usuário não encontrado ou senha incorreta
      }
      return rows[0];
    } catch (error) {}
  }
}

export default Usuario;
