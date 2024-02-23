import { Request, Response } from "express";
import { RegionController } from "../controllers/RegionController";
import { RegionService } from "../services/RegionService";
import { Region, RegionModel, UserModel } from "../models/models";
import { CustomError } from "../utils/customError";

describe("RegionController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let regionService: RegionService;
  let regionController: RegionController;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: "Região A",
        user: "65d8d7a22cb94b353c3f965a",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-122.511754, 37.77188],
              [-122.510133, 37.766956],
              [-122.513373, 37.76636],
              [-122.51385, 37.768337],
              [-122.512286, 37.770247],
              [-122.511754, 37.77188],
            ],
          ],
        },
      },
      params: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    regionService = new RegionService();
    regionController = new RegionController(regionService);
  });

  describe("createRegion", () => {
    it("should return 201 when creating a new region", async () => {
      const region = new RegionModel(mockRequest.body);
      jest.spyOn(regionService, "createRegion").mockResolvedValue(region);

      await regionController.createRegion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(region);
    });
  });
});

describe("RegionService", () => {
  let mockRequest: Partial<Request>;
  let regionService: RegionService;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: "Região A",
        user: "65d8d7a22cb94b353c3f965a",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-122.511754, 37.77188],
              [-122.510133, 37.766956],
              [-122.513373, 37.76636],
              [-122.51385, 37.768337],
              [-122.512286, 37.770247],
              [-122.511754, 37.77188],
            ],
          ],
        },
      },
      params: {},
    };
    regionService = new RegionService();
  });

  describe("createRegion", () => {
    it("should create a new region", async () => {
      // Mock do modelo de região
      const mockRegion = new RegionModel(mockRequest.body);

      // Mock do método create do RegionModel
      jest.spyOn(RegionModel, "create").mockResolvedValue(mockRegion as any);

      // Mock do método exists do UserModel
      jest.spyOn(UserModel, "exists").mockResolvedValue(true as any);

      // Teste da função createRegion
      const createdRegion = await regionService.createRegion(
        mockRequest.body as any
      );

      // Verificações
      expect(UserModel.exists).toHaveBeenCalledWith({
        _id: mockRequest.body.user,
      });
      expect(RegionModel.create).toHaveBeenCalledWith(mockRequest.body);
      expect(createdRegion).toEqual(mockRegion);
    });
    it("should throw an error when user does not exist", async () => {
      jest.spyOn(UserModel, "exists").mockResolvedValue(false as any);

      await expect(
        regionService.createRegion(mockRequest.body as any)
      ).rejects.toThrowError(new CustomError("User not found", 404));
    });
    it("should throw an error when region data is invalid", async () => {
      jest.spyOn(UserModel, "exists").mockResolvedValue(true as any);

      const invalidRegionData = {
        ...mockRequest.body,
        user: undefined,
      };

      await expect(
        regionService.createRegion(invalidRegionData as any)
      ).rejects.toThrowError(new CustomError("User is required", 400));
    });
  });
});
