import { query } from "../config/db.js";
import { AppError } from "../middlewares/errorHandler.js";

const CAMPOS = `id, nome, categoria, descricao, quantidade, estoque_minimo, preco,
  to_char(data_cadastro, 'YYYY-MM-DD') AS data_cadastro`;

const toDTO = (r) => ({
  id: r.id,
  nome: r.nome,
  categoria: r.categoria,
  descricao: r.descricao,
  quantidade: r.quantidade,
  estoqueMinimo: r.estoque_minimo,
  preco: Number(r.preco),
  dataCadastro: r.data_cadastro,
});

export function validarProduto(body, parcial = false) {
  const erros = [];
  const { nome, categoria, quantidade, estoqueMinimo, preco } = body;
  if (!parcial || nome !== undefined) {
    if (typeof nome !== "string" || !nome.trim()) erros.push("nome é obrigatório.");
    else if (nome.length > 150) erros.push("nome deve ter no máximo 150 caracteres.");
  }
  if (!parcial || categoria !== undefined) {
    if (typeof categoria !== "string" || !categoria.trim()) erros.push("categoria é obrigatória.");
  }
  if (!parcial || preco !== undefined) {
    if (typeof preco !== "number" || Number.isNaN(preco) || preco < 0) erros.push("preco deve ser um número maior ou igual a zero.");
  }
  if (quantidade !== undefined && (!Number.isInteger(quantidade) || quantidade < 0)) {
    erros.push("quantidade deve ser um inteiro maior ou igual a zero.");
  }
  if (estoqueMinimo !== undefined && (!Number.isInteger(estoqueMinimo) || estoqueMinimo < 0)) {
    erros.push("estoqueMinimo deve ser um inteiro maior ou igual a zero.");
  }
  return erros;
}

export async function listar(req, res) {
  const { busca, categoria, estoqueBaixo } = req.query;
  const filtros = [];
  const params = [];
  if (busca) {
    params.push(`%${busca}%`);
    filtros.push(`(nome ILIKE $${params.length} OR CAST(id AS TEXT) = $${params.length + 1})`);
    params.push(String(busca));
  }
  if (categoria) {
    params.push(categoria);
    filtros.push(`categoria = $${params.length}`);
  }
  if (estoqueBaixo === "true") filtros.push("quantidade <= estoque_minimo");
  const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
  const { rows } = await query(`SELECT ${CAMPOS} FROM produtos ${where} ORDER BY id`, params);
  res.json(rows.map(toDTO));
}

export async function buscarPorId(req, res) {
  const { rows } = await query(`SELECT ${CAMPOS} FROM produtos WHERE id = $1`, [req.params.id]);
  if (!rows[0]) throw new AppError(404, "Produto não encontrado.");
  res.json(toDTO(rows[0]));
}

export async function criar(req, res) {
  const erros = validarProduto(req.body);
  if (erros.length) throw new AppError(400, "Dados inválidos.", erros);
  const { nome, categoria, descricao = null, quantidade = 0, estoqueMinimo = 0, preco } = req.body;
  const { rows } = await query(
    `INSERT INTO produtos (nome, categoria, descricao, quantidade, estoque_minimo, preco)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [nome.trim(), categoria.trim(), descricao, quantidade, estoqueMinimo, preco]
  );
  const { rows: criado } = await query(`SELECT ${CAMPOS} FROM produtos WHERE id = $1`, [rows[0].id]);
  res.status(201).json(toDTO(criado[0]));
}

export async function atualizar(req, res) {
  const erros = validarProduto(req.body, true);
  if (erros.length) throw new AppError(400, "Dados inválidos.", erros);

  const mapa = { nome: "nome", categoria: "categoria", descricao: "descricao", quantidade: "quantidade", estoqueMinimo: "estoque_minimo", preco: "preco" };
  const sets = [];
  const params = [];
  for (const [campo, coluna] of Object.entries(mapa)) {
    if (req.body[campo] !== undefined) {
      params.push(typeof req.body[campo] === "string" ? req.body[campo].trim() : req.body[campo]);
      sets.push(`${coluna} = $${params.length}`);
    }
  }
  if (!sets.length) throw new AppError(400, "Nenhum campo para atualizar.");

  params.push(req.params.id);
  const { rows } = await query(
    `UPDATE produtos SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING id`,
    params
  );
  if (!rows[0]) throw new AppError(404, "Produto não encontrado.");
  const { rows: atualizado } = await query(`SELECT ${CAMPOS} FROM produtos WHERE id = $1`, [rows[0].id]);
  res.json(toDTO(atualizado[0]));
}

export async function excluir(req, res) {
  const { rowCount } = await query("DELETE FROM produtos WHERE id = $1", [req.params.id]);
  if (!rowCount) throw new AppError(404, "Produto não encontrado.");
  res.status(204).end();
}
