import { Request, Response } from "express";
import { SessionService } from "../services/SessionService";

class SessionController {
  async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const sessionService = new SessionService();
    const token = await sessionService.create({ email, password });
    return res.status(201).json({ token });
  }
}

export { SessionController };
