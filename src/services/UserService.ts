import { User, UserModel } from "../models/models";
import lib from "../utils/lib";

class UserService {
  // Criar um novo usuário
  async createUser(userData: User): Promise<User> {
    try {
      //Verifica se ambos endereco e coordenadas foram passados
      if (
        (userData.address && userData.coordinates) ||
        (!userData.address && !userData.coordinates)
      ) {
        throw new Error("Only one of address or coordinates should be passed!");
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
      const user = await UserModel.create(userData);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Obter todos os usuários
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      console.error("Erro ao obter usuários:", error);
      return [];
    }
  }

  // Obter um usuário por ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      console.error("Erro ao obter usuário por ID:", error);
      return null;
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
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return null;
    }
  }

  // Excluir um usuário
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await UserModel.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      return false;
    }
  }
}

export { UserService };
