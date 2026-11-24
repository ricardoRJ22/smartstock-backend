import { query, withTransaction } from "../config/db.js";
import { AppError } from "../middlewares/errorHandler.js";

const toDTO = (r) => ({
  id: r.id,
  produtoId: r.produto_id,
  produtoNome: r.produto_nome,
  tipo: r.tipo,
  quantidade: r.quantidade,
  data: r.data,
  observacao: r.observacao,
});

const SELECT_MOV = `
  SELECT m.id, m.produto_id, p.nome AS produto_nome, m.tipo, m.quantidade,
         m.data, m.observacao
  FROM movimentacoes m
  JOIN produtos p ON p.id = m.produto_id`;

export async function listar(req, res) {
  const { produtoId, tipo, limite } = req.query;
  const filtros = [];
  const params = [];
  if (produtoId) {
    params.push(produtoId);
    filtros.push(`m.produto_id = $${params.length}`);
  }
  if (tipo) {
    params.push(tipo.toUpperCase());
    filtros.push(`m.tipo = $${params.length}`);
  }
  const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
  const lim = Math.min(Number(limite) || 100, 500);
  const { rows } = await query(`${SELECT_MOV} ${where} ORDER BY m.data DESC, m.id DESC LIMIT ${lim}`, params);
  res.json(rows.map(toDTO));
}

export async function registrar(req, res) {
  const { produtoId, tipo, quantidade, observacao = null } = req.body;
  const erros = [];
  if (!Number.isInteger(produtoId)) erros.push("produtoId deve ser um inteiro.");
  if (!["ENTRADA", "SAIDA"].includes(tipo)) erros.push("tipo deve ser ENTRADA ou SAIDA.");
  if (!Number.isInteger(quantidade) || quantidade <= 0) erros.push("quantidade deve ser um inteiro maior que zero.");
  if (erros.length) throw new AppError(400, "Dados inválidos.", erros);

  const movId = await withTransaction(async (client) => {
    // Trava a linha do produto para evitar saldo negativo em requisições simultâneas.
    const { rows: prod } = await client.query("SELECT id, quantidade FROM produtos WHERE id = $1 FOR UPDATE", [produtoId]);
    if (!prod[0]) throw new AppError(404, "Produto não encontrado.");
    if (tipo === "SAIDA" && quantidade > prod[0].quantidade) {
      throw new AppError(422, `Saldo insuficiente. Disponível: ${prod[0].quantidade}.`);
    }
    const delta = tipo === "ENTRADA" ? quantidade : -quantidade;
    await client.query("UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2", [delta, produtoId]);
    const { rows } = await client.query(
      "INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao) VALUES ($1, $2, $3, $4) RETURNING id",
      [produtoId, tipo, quantidade, observacao]
    );
    return rows[0].id;
  });

  const { rows } = await query(`${SELECT_MOV} WHERE m.id = $1`, [movId]);
  res.status(201).json(toDTO(rows[0]));
}
