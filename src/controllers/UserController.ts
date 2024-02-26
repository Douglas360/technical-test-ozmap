import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { User } from "../models/models";
import { CustomError } from "../utils/customError";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async createUser(request: Request, response: Response) {
    const userData = request.body;
    try {
      const user = await this.userService.createUser(userData as User);

      return response.status(201).json(user);
    } catch (error: any) {
      if (error instanceof CustomError) {
        return response.status(error.statusCode).json({ eror: error.message });
      }
    }
  }

  async getAllUsers(request: Request, response: Response) {
    try {
      const users = await this.userService.getAllUsers();

      return response.status(200).json(users);
    } catch (error: any) {
      if (error instanceof CustomError) {
        return response.status(error.statusCode).json({ eror: error.message });
      }
    }
  }

  async getUserById(request: Request, response: Response) {
    const { userId } = request.params;
    try {
      const user = await this.userService.getUserById(userId);

      return response.status(201).json(user);
    } catch (error: any) {
      if (error instanceof CustomError) {
        return response.status(error.statusCode).json({ eror: error.message });
      }
    }
  }

  async updateUser(request: Request, response: Response) {
    const { userId } = request.params;
    const userData = request.body;

    try {
      const user = await this.userService.updateUser(userId, userData as User);

      return response.status(201).json(user);
    } catch (error: any) {
      if (error instanceof CustomError) {
        return response.status(error.statusCode).json({ eror: error.message });
      }
    }
  }

  async deleteUser(request: Request, response: Response) {
    const { userId } = request.params;

    try {
      await this.userService.deleteUser(userId);

      return response.status(204).json();
    } catch (error: any) {
      if (error instanceof CustomError) {
        return response.status(error.statusCode).json({ eror: error.message });
      }
    }
  }
}

export { UserController };
