import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { User } from "../models/models";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  async createUser(request: Request, response: Response) {
    const userData = request.body;

    const user = await this.userService.createUser(userData as User);

    /*if (!user) {
      return response.status(400).json({ error: "Error to create an user" });
    }*/

    return response.status(201).json(user);
  }

  async getAllUsers(request: Request, response: Response) {
    const users = await this.userService.getAllUsers();

    return response.status(200).json(users);
  }

  async getUserById(request: Request, response: Response) {
    const { userId } = request.params;

    const user = await this.userService.getUserById(userId);

    if (!user) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }

    return response.status(200).json(user);
  }

  async updateUser(request: Request, response: Response) {
    const { userId } = request.params;
    const userData = request.body;

    const user = await this.userService.updateUser(userId, userData);

    if (!user) {
      return response.status(400).json({ error: "Erro ao atualizar usuário" });
    }

    return response.status(200).json(user);
  }

  async deleteUser(request: Request, response: Response) {
    const { userId } = request.params;

    const deleted = await this.userService.deleteUser(userId);

    if (!deleted) {
      return response.status(400).json({ error: "Erro ao excluir usuário" });
    }

    return response.status(204).send();
  }
}

export { UserController };
