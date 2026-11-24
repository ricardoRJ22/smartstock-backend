-- Dados de exemplo (opcional)
INSERT INTO produtos (nome, categoria, descricao, quantidade, estoque_minimo, preco, data_cadastro) VALUES
  ('Café torrado 500g', 'Bebidas', 'Café torrado e moído', 3, 10, 24.90, '2026-11-02'),
  ('Papel A4 (cx.)', 'Papelaria', 'Caixa com 10 resmas', 12, 15, 129.00, '2026-11-05'),
  ('Caneta azul', 'Papelaria', 'Caneta esferográfica', 48, 20, 2.50, '2026-11-07'),
  ('Detergente 500ml', 'Limpeza', NULL, 90, 30, 3.80, '2026-11-10'),
  ('Toner HP 85A', 'Informática', 'Toner para impressora HP', 1, 2, 389.00, '2026-11-14'),
  ('Arroz 5kg', 'Alimentos', NULL, 40, 15, 27.50, '2026-11-15');

INSERT INTO movimentacoes (produto_id, tipo, quantidade, data) VALUES
  (1, 'ENTRADA', 20, '2026-06-12'), (2, 'ENTRADA', 30, '2026-07-03'),
  (4, 'ENTRADA', 60, '2026-07-18'), (3, 'SAIDA', 15, '2026-08-02'),
  (6, 'ENTRADA', 25, '2026-08-20'), (5, 'SAIDA', 2, '2026-09-09'),
  (1, 'SAIDA', 9, '2026-09-25'),    (4, 'SAIDA', 25, '2026-10-11'),
  (2, 'SAIDA', 18, '2026-10-28'),   (3, 'ENTRADA', 40, '2026-11-04'),
  (1, 'ENTRADA', 5, '2026-11-18'),  (6, 'SAIDA', 6, '2026-11-21');
