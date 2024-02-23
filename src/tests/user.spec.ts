import { Request, Response } from "express";
import { UserController } from "../../src/controllers/UserController";
import { UserService } from "../../src/services/UserService";
import { User, UserModel } from "../../src/models/models";
import lib from "../utils/lib";

describe("UserController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let userService: UserService;
  let userController: UserController;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        coordinates: { latitude: 123, longitude: 456 },
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    userService = new UserService();
    userController = new UserController(userService);
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      // Mock do userService.createUser para retornar um usuário
      userService.createUser = jest
        .fn()
        .mockResolvedValueOnce({ name: "John Doe", email: "john@example.com" });

      // Executa o método createUser do userController
      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Verifica se o status 201 foi chamado e se o usuário foi retornado no json de resposta
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });
  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const usersMock = [
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
      ];

      // Mock do userService.getAllUsers para retornar uma lista de usuários
      userService.getAllUsers = jest.fn().mockResolvedValueOnce(usersMock);

      // Executa o método getAllUsers do userController
      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      // Verifica se o status 200 foi chamado e se a lista de usuários foi retornada no json de resposta
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(usersMock);
    });
  });
  describe("getUserById", () => {
    it("should get user by id", async () => {
      const userId = "123456";
      const userMock = { name: "John Doe", email: "john@example.com" };

      // Mock do userService.getUserById para retornar um usuário
      userService.getUserById = jest.fn().mockResolvedValueOnce(userMock);

      // Executa o método getUserById do userController
      await userController.getUserById(
        { params: { userId } } as unknown as Request,
        mockResponse as Response
      );

      // Verifica se o status 201 foi chamado e se o usuário foi retornado no json de resposta
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(userMock);
    });
  });
});

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("createUser", () => {
    it("should create a new user when valid data is provided", async () => {
      const userData: User = new User();
      userData.name = "John Doe";
      userData.email = "john@example.com";
      //userData.address = "123 Main St";
      userData.coordinates = [123, 456];
      userData.regions = [];

      // Mock para o lib.getAddressFromCoordinates para retornar o endereço
      lib.getAddressFromCoordinates = jest
        .fn()
        .mockResolvedValueOnce("123 Main St");
      // Mock para o lib.getCoordinatesFromAddress para retornar as coordenadas
      lib.getCoordinatesFromAddress = jest
        .fn()
        .mockResolvedValueOnce({ lat: 123, lon: 456 });

      // Mock para o UserModel.create para retornar o usuário criado
      UserModel.create = jest.fn().mockResolvedValueOnce(userData);

      const user = await userService.createUser(userData);

      expect(user).toEqual(userData);
      expect(lib.getAddressFromCoordinates).toHaveBeenCalledWith(
        userData.coordinates
      );
      expect(lib.getCoordinatesFromAddress).toHaveBeenCalledWith(
        userData.address
      );
      expect(UserModel.create).toHaveBeenCalledWith(userData);
    });
    it("should throw an error if both address and coordinates are provided", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        coordinates: [123, 456],
      };

      await expect(
        userService.createUser(userData as User)
      ).rejects.toThrowError(
        "Only one of address or coordinates should be passed!"
      );
    });
    it("should throw an error if neither address nor coordinates are provided", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
      };

      await expect(
        userService.createUser(userData as User)
      ).rejects.toThrowError(
        "Only one of address or coordinates should be passed!"
      );
    });
  });
  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const usersMock = [
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
      ];

      // Mock do UserModel.find para retornar uma lista de usuários
      UserModel.find = jest.fn().mockResolvedValueOnce(usersMock);

      const users = await userService.getAllUsers();

      expect(users).toEqual(usersMock);
      expect(UserModel.find).toHaveBeenCalled();
    });
  });
  describe("getUserById", () => {
    it("should get user by id", async () => {
      const userId = "123456";
      const userMock = { name: "John Doe", email: "john@example.com" };

      // Mock do UserModel.findById para retornar um usuário
      UserModel.findById = jest.fn().mockResolvedValueOnce(userMock);

      const user = await userService.getUserById(userId);

      expect(user).toEqual(userMock);
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
    });

    it("should throw an error if user ID is not provided", async () => {
      const userId = ""; // Empty user ID

      await expect(userService.getUserById(userId)).rejects.toThrowError(
        "User ID is required!"
      );
    });

    it("should throw an error if user is not found", async () => {
      const userId = "nonexistentUserId";
      // Mock do UserModel.findById para retornar null (usuário não encontrado)
      UserModel.findById = jest.fn().mockResolvedValueOnce(null);

      await expect(userService.getUserById(userId)).rejects.toThrowError(
        "User not found!"
      );
    });
  });
});
