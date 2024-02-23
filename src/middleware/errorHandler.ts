import { Request, Response, NextFunction } from "express";
import winston from "winston";

//Configuração do logger
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [
    //new winston.transports.Console({ format: winston.format.simple() }), //Caso queira logar no console
    new winston.transports.File({ filename: "error.log" }),
  ],
});

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Loga o erro
  logger.error(err.message);

  // Verifica se o erro é uma instância de erro personalizado (por exemplo, ValidationError)
  if (err instanceof Error) {
    return res.status(400).json({
      eror: err.message,
    });
  }

  // Se não for um erro personalizado, retorna um erro genérico 500
  return res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
