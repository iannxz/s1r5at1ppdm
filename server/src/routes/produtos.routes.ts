import { Router } from "express";
import { ProdutoController } from "../controllers/produto.controller";

const produtoController = new ProdutoController();
const produtoRoutes = Router();

produtoRoutes.get("/produtos", produtoController.selecionarTodos);
produtoRoutes.get("/produtos/:id", produtoController.selecionarPorId);
produtoRoutes.post("/produtos", produtoController.criar);
produtoRoutes.patch("/produtos/:id", produtoController.editar);
produtoRoutes.delete("/produtos/:id", produtoController.deletar);

export default produtoRoutes;
