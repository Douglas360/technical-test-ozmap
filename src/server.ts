import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import "express-async-errors";
require("dotenv");
import * as dotenv from "dotenv";
import { router } from "./routes";
import "./database";

const path = require("path");

dotenv.config();

const app = express();

// Add this middleware to parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));
app.use(express.json());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      eror: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error.",
  });
});

app.listen(3001, () => {
  console.log("Rodando na porta 3001");
});

export { app };
