import { Region, RegionModel } from "../models//models";
import { Types } from "mongoose";

class RegionService {
  // Criar uma nova região
  async createRegion(regionData: Region): Promise<Region | null> {
    try {
      const region = await RegionModel.create(regionData);
      return region;
    } catch (error) {
      console.error("Erro ao criar região:", error);
      return null;
    }
  }

  // Obter todas as regiões
  async getAllRegions(): Promise<Region[]> {
    try {
      const regions = await RegionModel.find();
      return regions;
    } catch (error) {
      console.error("Erro ao obter regiões:", error);
      return [];
    }
  }

  // Obter uma região por ID
  async getRegionById(regionId: string): Promise<Region | null> {
    try {
      const region = await RegionModel.findById(regionId);
      return region;
    } catch (error) {
      console.error("Erro ao obter região por ID:", error);
      return null;
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
    } catch (error) {
      console.error("Erro ao atualizar região:", error);
      return null;
    }
  }

  // Excluir uma região
  async deleteRegion(regionId: string): Promise<boolean> {
    try {
      await RegionModel.findByIdAndDelete(regionId);
      return true;
    } catch (error) {
      console.error("Erro ao excluir região:", error);
      return false;
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
    } catch (error) {
      console.error("Erro ao obter regiões contendo um ponto:", error);
      return [];
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
    } catch (error) {
      console.error("Erro ao obter regiões próximas a um ponto:", error);
      return [];
    }
  }
}

export default new RegionService();
