import { Router } from "express";
import * as ctrl from "../controllers/dashboardController.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const router = Router();

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Indicadores para o painel inicial
 *     responses:
 *       200:
 *         description: Totais, produtos com estoque baixo, últimas movimentações e série mensal
 */
router.get("/", asyncHandler(ctrl.resumo));

export default router;
