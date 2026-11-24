import { Router } from "express";
import * as ctrl from "../controllers/produtosController.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const router = Router();

/**
 * @openapi
 * /api/produtos:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista e pesquisa produtos
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema: { type: string }
 *         description: Trecho do nome ou ID exato
 *       - in: query
 *         name: categoria
 *         schema: { type: string }
 *       - in: query
 *         name: estoqueBaixo
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Produto' } }
 *   post:
 *     tags: [Produtos]
 *     summary: Cadastra um produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProdutoEntrada' }
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Produto' }
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Erro' }
 */
router.get("/", asyncHandler(ctrl.listar));
router.post("/", asyncHandler(ctrl.criar));

/**
 * @openapi
 * /api/produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Busca um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Produto' }
 *       404:
 *         description: Não encontrado
 *   put:
 *     tags: [Produtos]
 *     summary: Atualiza um produto (campos enviados são alterados)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProdutoEntrada' }
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Produto' }
 *       404:
 *         description: Não encontrado
 *   delete:
 *     tags: [Produtos]
 *     summary: Exclui um produto (e suas movimentações)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Excluído
 *       404:
 *         description: Não encontrado
 */
router.get("/:id", asyncHandler(ctrl.buscarPorId));
router.put("/:id", asyncHandler(ctrl.atualizar));
router.delete("/:id", asyncHandler(ctrl.excluir));

export default router;
