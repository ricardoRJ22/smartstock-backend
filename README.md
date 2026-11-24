# SmartStock – Back-end (API)

API REST do Projeto Integrador SmartStock (Programa de Estágio de Férias, Dia 8).
Desenvolvida com **Node.js + Express**, banco **PostgreSQL** e documentação **Swagger**.

## Requisitos
- Node.js 18 ou superior
- PostgreSQL 14 ou superior

## Como rodar

1. Crie o banco:
   ```bash
   createdb smartstock        # ou crie pelo pgAdmin
   ```
2. Instale as dependências e configure o ambiente:
   ```bash
   npm install
   cp .env.example .env       # ajuste DATABASE_URL com sua senha
   ```
3. Crie as tabelas (com dados de exemplo, opcional):
   ```bash
   npm run db:init -- --seed
   ```
4. Inicie a API:
   ```bash
   npm run dev
   ```

- API: http://localhost:3333/api
- Swagger: http://localhost:3333/docs

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista e pesquisa (`busca`, `categoria`, `estoqueBaixo`) |
| POST | `/api/produtos` | Cadastra produto |
| GET | `/api/produtos/:id` | Busca produto |
| PUT | `/api/produtos/:id` | Atualiza produto |
| DELETE | `/api/produtos/:id` | Exclui produto |
| GET | `/api/movimentacoes` | Histórico (`produtoId`, `tipo`, `limite`) |
| POST | `/api/movimentacoes` | Registra entrada ou saída |
| GET | `/api/dashboard` | Indicadores do painel |
| GET | `/api/health` | Status da API |

## Regras de negócio
- Entrada soma ao estoque; saída subtrai.
- Saída acima do saldo retorna **422**.
- Movimentações usam transação com trava de linha (`FOR UPDATE`), evitando saldo negativo em acessos simultâneos.
- Excluir um produto remove também suas movimentações.

## Erros
Respostas de erro seguem o formato `{ "erro": "...", "detalhes": [...] }` com códigos 400, 404, 409, 422 e 500.

## Modelo de dados
Veja o DER em [docs/DER.md](docs/DER.md) e o script em [db/schema.sql](db/schema.sql).

## Estrutura
```
db/              Schema SQL, dados de exemplo e script de inicialização
src/
├── config/      Conexão com o banco e configuração do Swagger
├── controllers/ Regras de negócio e acesso ao banco
├── middlewares/ Tratamento de erros
├── routes/      Rotas com anotações Swagger
├── app.js       Criação da aplicação Express
└── server.js    Inicialização do servidor
```
