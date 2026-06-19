import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EnvVar } from "../config/EnvVar";

const authRoutes = Router();

const USUARIO = {
  email: "admin@admin.com",
  senha: "admin123",
};

authRoutes.post("/login", (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (email !== USUARIO.email || senha !== USUARIO.senha) {
    res.status(401).json({ error: "Credenciais inválidas." });
    return;
  }

  const token = jwt.sign({ email }, EnvVar.JWT_SECRET, { expiresIn: "8h" });
  res.status(200).json({ token });
});

export default authRoutes;
