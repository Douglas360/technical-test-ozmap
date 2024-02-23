import { Region, RegionModel, UserModel } from "../models//models";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError";

class RegionService {
  // Criar uma nova região
  async createRegion(regionData: Region): Promise<Region> {
    try {
      // Valida os dados da região
      this.validateRegionData(regionData);

      // Verifica se o usuário existe
      const userExists = await UserModel.exists({ _id: regionData.user });
      if (!userExists) {
        throw new CustomError("User not found", 404);
      }

      const region = await RegionModel.create(regionData);

      return region;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Obter todas as regiões
  async getAllRegions(): Promise<Region[]> {
    try {
      const regions = await RegionModel.find();
      return regions;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Obter uma região por ID
  async getRegionById(regionId: string): Promise<Region | null> {
    try {
      const region = await RegionModel.findById(regionId);
      return region;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Atualizar uma região existente
  async updateRegion(
    regionId: string,
    regionData: Partial<Region>
  ): Promise<Region | null> {
    try {
      const region = await RegionModel.findByIdAndUpdate(regionId, regionData, {
        new: true,
      });
      return region;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Excluir uma região
  async deleteRegion(regionId: string): Promise<boolean> {
    try {
      await RegionModel.findByIdAndDelete(regionId);
      return true;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Listar regiões contendo um ponto específico
  async getRegionsContainingPoint(
    longitude: number,
    latitude: number
  ): Promise<Region[]> {
    try {
      const point = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      const regions = await RegionModel.find({
        geometry: {
          $geoIntersects: {
            $geometry: point,
          },
        },
      });

      return regions;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Listar regiões a uma certa distância de um ponto
  async getRegionsNearPoint(
    longitude: number,
    latitude: number,
    maxDistance: number,
    userId: string | Types.ObjectId
  ): Promise<Region[]> {
    try {
      const point = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      const regions = await RegionModel.find({
        geometry: {
          $near: {
            $geometry: point,
            $maxDistance: maxDistance,
          },
        },
        user: userId, // Filtro para regiões pertencentes ao usuário
      });

      return regions;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  private validateRegionData(regionData: Region) {
    if (!regionData.name) {
      throw new CustomError("Name is required", 400);
    }
    if (!regionData.user) {
      throw new CustomError("User is required", 400);
    }
    if (!regionData.geometry.coordinates) {
      throw new CustomError("Coordinates is required", 400);
    }
    if (!Array.isArray(regionData.geometry.coordinates)) {
      throw new CustomError("Coordinates must be an array", 400);
    }
  }
}

export { RegionService };
