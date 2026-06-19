import express from "express";
import path from "node:path";
import cors from "cors";
import { EnvVar } from "./config/EnvVar";
import router from "./routes/routes";

const app = express();
const frontendPath = path.resolve(process.cwd(), "frontend");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendPath));

app.get("/health", (_req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/", router);

app.use((_req, res) => {
  return res.status(404).json({ error: "Rota nao encontrada." });
});

app.use(((error, _req, res, _next) => {
  console.error("Erro interno no servidor:", error);
  return res.status(500).json({
    error: "Erro interno no servidor.",
    errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
  });
}) as express.ErrorRequestHandler);

app.listen(EnvVar.SERVER_PORT, () => {
  console.log(`Server rodando em http://localhost:${EnvVar.SERVER_PORT}`);
});
