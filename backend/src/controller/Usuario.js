import pool from "../config/bd.js";
import bcrypt from "bcrypt";

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
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const sql = `INSERT INTO usuario (nome, email, senha, telefone, tipo, imagem_perfil) VALUES (?, ?, ?, ?, ?, ?)`;
      const [resultados] = await pool.query(sql, [
        nome,
        email,
        senhaCriptografada,
        telefone,
        tipo,
        foto,
      ]);
      if (resultados.affectedRows == 0) {
        return null;
      }
      return resultados;
    } catch (error) {
      console.log("Erro no controller:", error);
      return 0;
    }
  }

  static async encontrarPorEmail(email) {
    try {
      const sql = `SELECT * FROM usuario WHERE email = ?`;
      const [rows] = await pool.query(sql, [email]);
      return rows[0];
    } catch (error) {
      console.log("Erro ao encontrar por email:", error.message);
      return null;
    }
  }

  static async encontrarTodos() {
    try {
      const sql = `SELECT * FROM usuario`;
      const [rows] = await pool.query(sql);
      const usuariosConvertidos = rows.map((user) => ({
        ...user,
        imagem_perfil: user.imagem_perfil
          ? user.imagem_perfil.toString("base64")
          : null,
      }));
      return usuariosConvertidos;
    } catch (error) {
      console.log("Erro ao buscar todos os usuários:", error.message);
      return [];
    }
  }

  static async atualizarUsuario(
    id,
    nome,
    email,
    telefone,
    senha,
    senhaNova,
    tipo,
    foto
  ) {
    console.log("controller");
    try {
      let campos = [];
      let valores = [];

      // Campos obrigatórios
      campos.push("nome = ?", "email = ?", "telefone = ?", "tipo = ?");
      valores.push(nome, email, telefone, tipo);

      // Se foi fornecida uma nova senha, criptografa e adiciona ao update
      if (senha && senha.trim() !== "") {
        console.log("verifica senha");
        console.log(this.encontrarUsuarioPorId(id).senha !== senha);
        console.log();
        console.log("verifica senha");

        const usuario = await this.encontrarUsuarioPorId(id);

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        console.log(senhaCorreta);
        console.log("senhas");

        if (senhaCorreta) {
          const senhaCriptografada = await bcrypt.hash(senhaNova, 10);
          campos.push("senha = ?");
          valores.push(senhaCriptografada);
        } else {
          return;
        }
      }

      if (foto == "vazio") {
        campos.push("imagem_perfil = ?");
        valores.push(null);
      } else if (foto) {
        campos.push("imagem_perfil = ?");
        valores.push(foto);
      }

      const sql = `UPDATE usuario SET ${campos.join(", ")} WHERE id = ?`;
      valores.push(id);
      console.log(sql);
      console.log(valores);

      const [result] = await pool.query(sql, valores);
      console.log("controller1");
      console.log(result);
      console.log("controller2");

      if (result.affectedRows) {
        return this.encontrarUsuarioPorId(id);
      }
      return result;
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error.message);
      return 0;
    }
  }

  static async deletarUsuario(id) {
    try {
      const sql = `DELETE FROM usuario WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      console.log("Erro ao deletar usuário:", error.message);
      return 0;
    }
  }

  static async login({ email, senha }) {
    try {
      const sql = `SELECT * FROM usuario WHERE email = ?`;
      const [rows] = await pool.query(sql, [email]);
      if (rows.length === 0) {
        return null;
      }
      const usuario = rows[0];
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return null;
      }
      return usuario;
    } catch (error) {
      console.error("Erro no login:", error.message);
      return null;
    }
  }

  static async encontrarUsuarioPorId(id) {
    try {
      const sql = `SELECT * FROM usuario WHERE id = ?`;
      const [rows] = await pool.query(sql, [id]);
      if (rows.length === 0) {
        return null;
      }
      const usuario = rows[0];

      return usuario;
    } catch (error) {
      console.log("Erro ao encontrar usuário por ID:", error.message);
      return null;
    }
  }
}

export default Usuario;
