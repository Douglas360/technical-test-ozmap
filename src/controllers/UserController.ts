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

    return response.status(201).json(user);
  }

  async getAllUsers(request: Request, response: Response) {
    const users = await this.userService.getAllUsers();

    return response.status(200).json(users);
  }

  async getUserById(request: Request, response: Response) {
    const { userId } = request.params;

    const user = await this.userService.getUserById(userId);

    return response.status(201).json(user);
  }

  async updateUser(request: Request, response: Response) {
    const { userId } = request.params;
    const userData = request.body;

    const user = await this.userService.updateUser(userId, userData);

    return response.status(201).json(user);
  }

  async deleteUser(request: Request, response: Response) {
    const { userId } = request.params;

    await this.userService.deleteUser(userId);

    return response.status(204).send();
  }
}

export { UserController };
