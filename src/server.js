import "dotenv/config";
import { createApp } from "./app.js";

const port = process.env.PORT || 3333;
createApp().listen(port, () => {
  console.log(`SmartStock API rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/docs`);
});
