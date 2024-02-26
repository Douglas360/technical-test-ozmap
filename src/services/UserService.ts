import { hash } from "bcryptjs";
import { User, UserModel } from "../models/models";
import { CustomError } from "../utils/customError";
import lib from "../utils/lib";

class UserService {
  async createUser(userData: User): Promise<User> {
    try {
      // Valida os dados do usuário
      this.validateUserData(userData);

      // Verifica se o usuário já existe
      const userExists = await UserModel.findOne({ email: userData.email });
      if (userExists) {
        throw new CustomError("User already exists!", 400);
      }

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

      if (userData.password) {
        userData.password = await hash(userData.password, 8);
      }
      const user = await UserModel.create(userData);
      return user;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode || 999);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode || 999);
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      this.validadeUserID(userId);
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new CustomError("User not found!", 404);
      }
      return user;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode || 999);
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      this.validateUserDataUpdate(userData);
      // Se as coordenadas forem fornecidas, atualiza o endereço com base nelas
      if (userData.coordinates) {
        userData.address = await lib.getAddressFromCoordinates(
          userData.coordinates
        );
      }

      // Se o endereço for fornecido, atualiza as coordenadas com base nele
      if (userData.address) {
        const { lat, lon } = await lib.getCoordinatesFromAddress(
          userData.address
        );
        userData.coordinates = [lat, lon];
      }
      // Atualiza o usuário no banco de dados
      const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });

      return updatedUser;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode || 999);
    }
  }

  async deleteUser(userId: string) {
    try {
      this.validateUserDelete(userId);

      const deletedUser = await UserModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new CustomError("User not found!", 404);
      }

      return { message: "User deleted successfully" };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode || 999);
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
  private validateUserDataUpdate(userData: Partial<User>) {
    // Verifica se a atualização inclui tanto endereço quanto coordenadas, o que não é permitido
    if (
      (userData.address && userData.coordinates) ||
      (!userData.address && !userData.coordinates)
    ) {
      throw new CustomError(
        "Only one of address or coordinates should be updated!",
        400
      );
    }
  }
  private validateUserDelete(userId: string) {
    if (!userId) {
      throw new CustomError("User ID is required!", 400);
    }
  }
}

export { UserService };
