import { Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { RegionService } from "../services/RegionService";
import { Region } from "../models/models";

class RegionController {
  private regionService: RegionService;

  constructor(regionService: RegionService) {
    this.regionService = regionService;
    this.createRegion = this.createRegion.bind(this);
    this.getAllRegions = this.getAllRegions.bind(this);
    this.getRegionById = this.getRegionById.bind(this);
    this.updateRegion = this.updateRegion.bind(this);
    this.deleteRegion = this.deleteRegion.bind(this);
    this.getRegionContainingCoordinates =
      this.getRegionContainingCoordinates.bind(this);
    this.getRegionNearCoordinates = this.getRegionNearCoordinates.bind(this);
  }

  async createRegion(request: Request, response: Response) {
    const token = request.headers.authorization?.split(" ")[1];
    const decodedToken = decode(token as string) as { id: string };
    const userId = decodedToken.id;

    const regionData = request.body;
    regionData.user = userId;

    const region = await this.regionService.createRegion(regionData as Region);

    return response.status(201).json(region);
  }

  async getAllRegions(request: Request, response: Response) {
    const regions = await this.regionService.getAllRegions();

    return response.status(200).json(regions);
  }

  async getRegionById(request: Request, response: Response) {
    const { regionId } = request.params;

    const region = await this.regionService.getRegionById(regionId);

    return response.status(201).json(region);
  }

  async updateRegion(request: Request, response: Response) {
    const { regionId } = request.params;
    const regionData = request.body;

    const region = await this.regionService.updateRegion(regionId, regionData);

    return response.status(201).json(region);
  }

  async deleteRegion(request: Request, response: Response) {
    const { regionId } = request.params;

    const region = await this.regionService.deleteRegion(regionId);

    return response.status(204).json(region);
  }

  async getRegionContainingCoordinates(request: Request, response: Response) {
    const { latitude, longitude } = request.query;

    const region = await this.regionService.getRegionContainingCoordinates(
      Number(longitude),
      Number(latitude)
    );

    return response.status(200).json(region);
  }

  async getRegionNearCoordinates(request: Request, response: Response) {
    const { latitude, longitude, maxDistance, userId } = request.query;

    const region = await this.regionService.getRegionNearCoordinates(
      Number(longitude),
      Number(latitude),
      Number(maxDistance),
      userId as string
    );

    return response.status(200).json(region);
  }
}

export { RegionController };
