import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
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

  // Função para gerar um token JWT válido com um ID de usuário
  function generateValidToken(userId: string): string {
    // Chave secreta para assinar o token JWT
    const secretKey = "secret_key_for_testing";

    // Payload do token contendo o ID do usuário
    const payload = {
      id: userId,
      // Você pode adicionar outras informações ao payload, se necessário
    };

    // Opções de assinatura do token
    const options: SignOptions = {
      expiresIn: "1h", // Tempo de expiração do token
    };

    // Assinatura do token JWT usando a chave secreta e as opções especificadas
    const token = jwt.sign(payload, secretKey, options);

    return token;
  }

  describe("createRegion", () => {
    it("should return 201 when creating a new region", async () => {
      // Simulando um token JWT válido com um ID de usuário
      const userId = "user123";
      const validToken = generateValidToken(userId);

      // Definindo o token JWT válido no cabeçalho de autorização da solicitação simulada
      mockRequest.headers = { authorization: `Bearer ${validToken}` };

      // Dados do corpo da solicitação
      const regionData = {
        name: "Região A",
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
      };

      // Definindo o corpo da solicitação
      mockRequest.body = regionData;

      // Simulando o comportamento do serviço para criar uma região
      const createdRegion = new RegionModel(regionData);
      jest
        .spyOn(regionService, "createRegion")
        .mockResolvedValue(createdRegion);

      // Chamando o método createRegion do controlador
      await regionController.createRegion(
        mockRequest as Request,
        mockResponse as Response
      );

      // Verificando se o status e os dados da região criada foram retornados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdRegion);
    });
  });
  describe("getAllRegions", () => {
    it("should return all regions", async () => {
      const regions: Region[] = [new Region()];
      jest.spyOn(regionService, "getAllRegions").mockResolvedValue(regions);

      await regionController.getAllRegions(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(regions);
    });
  });
  describe("getRegionById", () => {
    it("should return a region by ID", async () => {
      const region = new Region();
      const regionId = "123";
      mockRequest.params = { regionId };
      jest.spyOn(regionService, "getRegionById").mockResolvedValue(region);

      await regionController.getRegionById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(region);
    });
  });
  describe("updateRegion", () => {
    it("should update a region", async () => {
      const regionId = "123";
      mockRequest.params = { regionId };
      jest.spyOn(regionService, "updateRegion").mockResolvedValue(null);

      await regionController.updateRegion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe("deleteRegion", () => {
    it("should delete a region", async () => {
      const regionId = "123";
      mockRequest.params = { regionId };
      jest.spyOn(regionService, "deleteRegion").mockResolvedValue(null);

      await regionController.deleteRegion(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe("getRegionContainingCoordinates", () => {
    it("should return regions containing coordinates", async () => {
      mockRequest.query = { latitude: "37", longitude: "-122" };
      const regions: Region[] = [new Region()];
      jest
        .spyOn(regionService, "getRegionContainingCoordinates")
        .mockResolvedValue(regions);

      await regionController.getRegionContainingCoordinates(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(regions);
    });
  });
  describe("getRegionNearCoordinates", () => {
    it("should return regions near coordinates", async () => {
      mockRequest.query = {
        latitude: "37",
        longitude: "-122",
        maxDistance: "1000",
        userId: "123",
      };
      const regions: Region[] = [new Region()];
      jest
        .spyOn(regionService, "getRegionNearCoordinates")
        .mockResolvedValue(regions);

      await regionController.getRegionNearCoordinates(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(regions);
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
  describe("getAllRegions", () => {
    it("should return all regions", async () => {
      const regions: Region[] = [new Region()];

      jest.spyOn(RegionModel, "find").mockResolvedValueOnce(regions as any);

      const result = await regionService.getAllRegions();

      expect(result).toEqual(regions);
    });

    it("should throw an error if retrieval fails", async () => {
      jest
        .spyOn(RegionModel, "find")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(regionService.getAllRegions()).rejects.toThrowError(
        CustomError
      );
    });
  });
  describe("getRegionById", () => {
    it("should return a region by ID", async () => {
      const regionId = "123";
      const region = new Region();

      jest.spyOn(RegionModel, "findById").mockResolvedValueOnce(region as any);

      const result = await regionService.getRegionById(regionId);

      expect(result).toEqual(region);
    });

    it("should return 404 if region is not found", async () => {
      const regionId = "123";

      jest.spyOn(RegionModel, "findById").mockResolvedValueOnce(null);

      try {
        await regionService.getRegionById(regionId);
      } catch (error) {
        expect(error.statusCode).toBe(404); // Verifica se o status code é 404
      }
    });

    it("should throw an error if retrieval fails", async () => {
      const regionId = "123";

      jest
        .spyOn(RegionModel, "findById")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(regionService.getRegionById(regionId)).rejects.toThrowError(
        CustomError
      );
    });
  });
  describe("updateRegion", () => {
    it("should update a region", async () => {
      const regionId = "123";
      const regionData = { name: "Região B" };
      const updatedRegion = new Region();

      jest
        .spyOn(RegionModel, "findByIdAndUpdate")
        .mockResolvedValueOnce(updatedRegion as any);

      const result = await regionService.updateRegion(regionId, regionData);

      expect(result).toEqual(updatedRegion);
    });

    it("should return null if region is not found", async () => {
      const regionId = "123";
      const regionData = { name: "Região B" };

      jest.spyOn(RegionModel, "findByIdAndUpdate").mockResolvedValueOnce(null);

      const result = await regionService.updateRegion(regionId, regionData);

      expect(result).toBeNull();
    });

    it("should throw an error if update fails", async () => {
      const regionId = "123";
      const regionData = { name: "Região B" };

      jest
        .spyOn(RegionModel, "findByIdAndUpdate")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(
        regionService.updateRegion(regionId, regionData)
      ).rejects.toThrowError(CustomError);
    });
  });
  describe("deleteRegion", () => {
    it("should delete a region", async () => {
      const regionId = "123";

      jest.spyOn(RegionModel, "findByIdAndDelete").mockResolvedValueOnce(true);

      const result = await regionService.deleteRegion(regionId);

      expect(result).toBe(true);
    });

    it("should throw an error if deletion fails", async () => {
      const regionId = "123";

      jest
        .spyOn(RegionModel, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(regionService.deleteRegion(regionId)).rejects.toThrowError(
        CustomError
      );
    });
  });
  describe("getRegionContainingCoordinates", () => {
    it("should return regions containing coordinates", async () => {
      const latitude = 37;
      const longitude = -122;
      const regions: Region[] = [new Region()];

      jest.spyOn(RegionModel, "find").mockResolvedValueOnce(regions as any);

      const result = await regionService.getRegionContainingCoordinates(
        latitude,
        longitude
      );

      expect(result).toEqual(regions);
    });

    it("should throw an error if retrieval fails", async () => {
      const latitude = 37;
      const longitude = -122;

      jest
        .spyOn(RegionModel, "find")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(
        regionService.getRegionContainingCoordinates(latitude, longitude)
      ).rejects.toThrowError(CustomError);
    });
  });
  describe("getRegionNearCoordinates", () => {
    it("should return regions near coordinates", async () => {
      const latitude = 37;
      const longitude = -122;
      const maxDistance = 1000;
      const userId = "123";
      const regions: Region[] = [new Region()];

      jest
        .spyOn(RegionModel, "aggregate")
        .mockResolvedValueOnce(regions as any);

      const result = await regionService.getRegionNearCoordinates(
        latitude,
        longitude,
        maxDistance,
        userId
      );

      expect(result).toEqual(regions);
    });

    it("should throw an error if retrieval fails", async () => {
      const latitude = 37;
      const longitude = -122;
      const maxDistance = 1000;
      const userId = "123";

      jest
        .spyOn(RegionModel, "aggregate")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(
        regionService.getRegionNearCoordinates(
          latitude,
          longitude,
          maxDistance,
          userId
        )
      ).rejects.toThrowError(CustomError);
    });
  });
});
