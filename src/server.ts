import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import "express-async-errors";
require("dotenv");
import { router } from "./routes";
import "./database";
import errorHandler from "./middleware/errorHandler";

const path = require("path");

const app = express();

// Add this middleware to parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));

const publicPath = path.resolve(__dirname, "../public");

app.use(express.static(publicPath));

app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});

export { app };
