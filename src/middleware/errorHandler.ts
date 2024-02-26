import { Request, Response, NextFunction } from "express";
import winston from "winston";

//Looger configuration
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [new winston.transports.File({ filename: "error.log" })],
});

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Console error
  logger.error(err.message);

  // Verify if the error is a custom error
  if (err instanceof Error) {
    return res.status(res.statusCode).json({
      eror: err.message,
    });
  }

  // If the error is not a custom error, return a 500 error
  return res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
