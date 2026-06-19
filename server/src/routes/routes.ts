import { Router } from "express";
import categoriaRoutes from "./categoria.routes";
import produtoRoutes from "./produtos.routes";
import authRoutes from "./auth.routes";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use("/", authRoutes);

router.use(authMiddleware);

router.use("/", categoriaRoutes);
router.use("/", produtoRoutes);

export default router;
