import { app } from "./app";

const server = app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});

export { server };
