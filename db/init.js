// Cria as tabelas (e opcionalmente os dados de exemplo): npm run db:init
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "../src/config/db.js";

const dir = dirname(fileURLToPath(import.meta.url));
const seed = process.argv.includes("--seed");

try {
  await pool.query(readFileSync(join(dir, "schema.sql"), "utf8"));
  console.log("Tabelas criadas.");
  if (seed) {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM produtos");
    if (rows[0].n === 0) {
      await pool.query(readFileSync(join(dir, "seed.sql"), "utf8"));
      console.log("Dados de exemplo inseridos.");
    } else {
      console.log("Banco já possui produtos; seed ignorado.");
    }
  }
} catch (err) {
  console.error("Erro ao inicializar o banco:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
