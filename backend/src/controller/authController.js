// controllers/authController.js
import bcrypt from "bcryptjs";
import { findByEmail } from "../models/userModel.js";
import { generateToken } from "../config/auth.js";

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = generateToken(user.id);
  res.json({ token });
}
