import { User, UserModel } from "../models/models";
import { CustomError } from "../utils/customError";
import lib from "../utils/lib";

class UserService {
  // Criar um novo usuário
  async createUser(userData: User): Promise<User> {
    try {
      // Valida os dados do usuário
      this.validateUserData(userData);

      //Resolve o endereco a partir das coordenadas
      if (userData.coordinates) {
        userData.address = await lib.getAddressFromCoordinates(
          userData.coordinates
        );
      }

      //Resolve as coordenadas a partir do endereco
      if (userData.address) {
        const { lat, lon } = await lib.getCoordinatesFromAddress(
          userData.address
        );
        userData.coordinates = [lat, lon];
      }
      const user = await UserModel.create(userData);
      return user;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Obter todos os usuários
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Obter um usuário por ID
  async getUserById(userId: string): Promise<User> {
    try {
      this.validadeUserID(userId);
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new CustomError("User not found!", 404);
      }
      return user;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Atualizar um usuário existente
  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      return user;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Excluir um usuário
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await UserModel.findByIdAndDelete(userId);
      return true;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  private validateUserData(userData: User) {
    if (
      (userData.address && userData.coordinates) ||
      (!userData.address && !userData.coordinates)
    ) {
      throw new CustomError(
        "Only one of address or coordinates should be passed!",
        400
      );
    }
  }

  private validadeUserID(userId: string) {
    if (!userId) {
      throw new CustomError("User ID is required!", 400);
    }
  }
}

export { UserService };
