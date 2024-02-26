import express from "express";
import bodyParser from "body-parser";
import "express-async-errors";
import { router } from "./routes";
import { initDb } from "./database";
import errorHandler from "./middleware/errorHandler";

const path = require("path");

// Inicializa a conexão com o banco de dados
initDb();

const app = express();

// Adiciona o middleware de tratamento de erros
app.use(bodyParser.urlencoded({ extended: true }));

const publicPath = path.resolve(__dirname, "../public");

app.use(express.static(publicPath));

app.use(express.json());

app.use(router);

app.use(errorHandler);

export { app };
