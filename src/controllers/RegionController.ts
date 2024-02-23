import { Request, Response } from "express";
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
  }

  async createRegion(request: Request, response: Response) {
    const regionData = request.body;

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
}

export { RegionController };
