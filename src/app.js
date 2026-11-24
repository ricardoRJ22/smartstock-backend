import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import produtosRoutes from "./routes/produtos.js";
import movimentacoesRoutes from "./routes/movimentacoes.js";
import dashboardRoutes from "./routes/dashboard.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
  app.use(express.json());

  /**
   * @openapi
   * /api/health:
   *   get:
   *     tags: [Sistema]
   *     summary: Verifica se a API está no ar
   *     responses:
   *       200:
   *         description: API funcionando
   */
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "SmartStock API" }));
  app.get("/docs.json", (req, res) => res.json(swaggerSpec));

  app.use("/api/produtos", produtosRoutes);
  app.use("/api/movimentacoes", movimentacoesRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
