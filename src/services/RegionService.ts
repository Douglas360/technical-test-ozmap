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
      // Valida os dados da região
      this.validateRegionUpdateData(regionData);
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
      // Valida o ID da região
      this.validateRegionDelete(regionId);
      const deleted = await RegionModel.findByIdAndDelete(regionId);
      if (!deleted) {
        throw new CustomError("Region not found", 404);
      }

      return true;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Listar regiões contendo um ponto específico
  async getRegionContainingCoordinates(
    longitude: number,
    latitude: number
  ): Promise<Region[]> {
    try {
      // Valida as coordenadas
      this.validateRegionContainingCoordinates(longitude, latitude);
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

      if (regions.length === 0) {
        throw new CustomError("No regions found", 404);
      }

      return regions;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  // Listar regiões a uma certa distância de um ponto
  async getRegionNearCoordinates(
    longitude: number,
    latitude: number,
    maxDistance: number,
    userId: string | Types.ObjectId
  ): Promise<Region[]> {
    try {
      // Valida as coordenadas
      this.validateRegionNearCoordinates(
        longitude,
        latitude,
        maxDistance,
        userId
      );
      const regions = await RegionModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            distanceField: "distance", // Opcional: armazenar a distância nos resultados
            maxDistance: maxDistance,
            spherical: true, // Se aplicável
          },
        },
        { $match: { user: userId } }, // Filtrar por usuário após geoNear
      ]);

      if (regions.length === 0) {
        throw new CustomError("No regions found", 404);
      }

      return regions;
    } catch (error: any) {
      throw new CustomError(error.message, 400);
    }
  }

  /*METODOS VALIDADORES */
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

  private validateRegionUpdateData(regionData: Partial<Region>) {
    if (regionData.name && !regionData.name) {
      throw new CustomError("Name is required", 400);
    }
    if (regionData.user && !regionData.user) {
      throw new CustomError("User is required", 400);
    }
    if (regionData.geometry && !regionData.geometry.coordinates) {
      throw new CustomError("Coordinates is required", 400);
    }
    if (
      regionData.geometry &&
      !Array.isArray(regionData.geometry.coordinates)
    ) {
      throw new CustomError("Coordinates must be an array", 400);
    }
  }

  private validateRegionDelete(regionId: string) {
    if (!regionId) {
      throw new CustomError("Region ID is required", 400);
    }
  }

  private validateRegionContainingCoordinates(
    longitude: number,
    latitude: number
  ) {
    if (!longitude || !latitude) {
      throw new CustomError("Longitude and latitude are required", 400);
    }
  }

  private validateRegionNearCoordinates(
    longitude: number,
    latitude: number,
    maxDistance: number,
    userId: string | Types.ObjectId
  ) {
    if (!longitude || !latitude) {
      throw new CustomError("Longitude and latitude are required", 400);
    }
    if (!maxDistance) {
      throw new CustomError("Max distance is required", 400);
    }
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
  }
}

export { RegionService };
