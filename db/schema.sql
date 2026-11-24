-- SmartStock - esquema do banco (PostgreSQL)

CREATE TABLE IF NOT EXISTS produtos (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(150)  NOT NULL,
    categoria       VARCHAR(80)   NOT NULL,
    descricao       TEXT,
    quantidade      INTEGER       NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    estoque_minimo  INTEGER       NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
    preco           NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
    data_cadastro   DATE          NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS movimentacoes (
    id          SERIAL PRIMARY KEY,
    produto_id  INTEGER     NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    tipo        VARCHAR(7)  NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA')),
    quantidade  INTEGER     NOT NULL CHECK (quantidade > 0),
    data        TIMESTAMP   NOT NULL DEFAULT now(),
    observacao  TEXT
);

CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto ON movimentacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data    ON movimentacoes(data);
