import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "SmartStock API",
      version: "1.0.0",
      description: "API REST do sistema de gestão de estoque SmartStock.",
    },
    servers: [{ url: "http://localhost:3333", description: "Desenvolvimento" }],
    components: {
      schemas: {
        Produto: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Café torrado 500g" },
            categoria: { type: "string", example: "Bebidas" },
            descricao: { type: "string", nullable: true },
            quantidade: { type: "integer", example: 3 },
            estoqueMinimo: { type: "integer", example: 10 },
            preco: { type: "number", example: 24.9 },
            dataCadastro: { type: "string", format: "date", example: "2026-11-02" },
          },
        },
        ProdutoEntrada: {
          type: "object",
          required: ["nome", "categoria", "preco"],
          properties: {
            nome: { type: "string" },
            categoria: { type: "string" },
            descricao: { type: "string" },
            quantidade: { type: "integer", minimum: 0, default: 0 },
            estoqueMinimo: { type: "integer", minimum: 0, default: 0 },
            preco: { type: "number", minimum: 0 },
          },
        },
        Movimentacao: {
          type: "object",
          properties: {
            id: { type: "integer" },
            produtoId: { type: "integer" },
            produtoNome: { type: "string" },
            tipo: { type: "string", enum: ["ENTRADA", "SAIDA"] },
            quantidade: { type: "integer" },
            data: { type: "string", format: "date-time" },
            observacao: { type: "string", nullable: true },
          },
        },
        MovimentacaoEntrada: {
          type: "object",
          required: ["produtoId", "tipo", "quantidade"],
          properties: {
            produtoId: { type: "integer" },
            tipo: { type: "string", enum: ["ENTRADA", "SAIDA"] },
            quantidade: { type: "integer", minimum: 1 },
            observacao: { type: "string" },
          },
        },
        Erro: {
          type: "object",
          properties: {
            erro: { type: "string" },
            detalhes: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
});
