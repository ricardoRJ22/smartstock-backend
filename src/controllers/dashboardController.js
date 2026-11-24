import { query } from "../config/db.js";

export async function resumo(req, res) {
  const { rows: [totais] } = await query(`
    SELECT COUNT(*)::int AS total_produtos,
           COALESCE(SUM(quantidade), 0)::int AS total_unidades,
           COUNT(*) FILTER (WHERE quantidade <= estoque_minimo)::int AS estoque_baixo
    FROM produtos`);

  const { rows: baixos } = await query(`
    SELECT id, nome, categoria, quantidade, estoque_minimo
    FROM produtos WHERE quantidade <= estoque_minimo
    ORDER BY quantidade ASC, nome ASC`);

  const { rows: recentes } = await query(`
    SELECT m.id, m.produto_id, p.nome AS produto_nome, m.tipo, m.quantidade, m.data
    FROM movimentacoes m JOIN produtos p ON p.id = m.produto_id
    ORDER BY m.data DESC, m.id DESC LIMIT 5`);

  // Totais de entradas e saídas dos últimos 6 meses (para o gráfico).
  const { rows: serie } = await query(`
    SELECT to_char(date_trunc('month', data), 'YYYY-MM') AS mes,
           COALESCE(SUM(quantidade) FILTER (WHERE tipo = 'ENTRADA'), 0)::int AS entradas,
           COALESCE(SUM(quantidade) FILTER (WHERE tipo = 'SAIDA'), 0)::int AS saidas
    FROM movimentacoes
    WHERE data >= date_trunc('month', now()) - INTERVAL '5 months'
    GROUP BY 1 ORDER BY 1`);

  res.json({
    totalProdutos: totais.total_produtos,
    totalUnidades: totais.total_unidades,
    estoqueBaixo: totais.estoque_baixo,
    produtosEstoqueBaixo: baixos.map((p) => ({
      id: p.id, nome: p.nome, categoria: p.categoria, quantidade: p.quantidade, estoqueMinimo: p.estoque_minimo,
    })),
    ultimasMovimentacoes: recentes.map((m) => ({
      id: m.id, produtoId: m.produto_id, produtoNome: m.produto_nome, tipo: m.tipo, quantidade: m.quantidade, data: m.data,
    })),
    serieMensal: serie,
  });
}
