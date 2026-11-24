import { Router } from "express";
import * as ctrl from "../controllers/movimentacoesController.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const router = Router();

/**
 * @openapi
 * /api/movimentacoes:
 *   get:
 *     tags: [Movimentações]
 *     summary: Histórico de movimentações
 *     parameters:
 *       - in: query
 *         name: produtoId
 *         schema: { type: integer }
 *       - in: query
 *         name: tipo
 *         schema: { type: string, enum: [ENTRADA, SAIDA] }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 100, maximum: 500 }
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Movimentacao' } }
 *   post:
 *     tags: [Movimentações]
 *     summary: Registra entrada ou saída (atualiza o estoque automaticamente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MovimentacaoEntrada' }
 *     responses:
 *       201:
 *         description: Movimentação registrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Movimentacao' }
 *       404:
 *         description: Produto não encontrado
 *       422:
 *         description: Saldo insuficiente para a saída
 */
router.get("/", asyncHandler(ctrl.listar));
router.post("/", asyncHandler(ctrl.registrar));

export default router;
