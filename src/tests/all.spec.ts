import request from "supertest";
import { app } from "../app";
import { closeDb, clearDb } from "../database";

describe("Integration test", () => {
  //Create a new user before all tests
  beforeAll(async () => {
    await request(app).post("/user").send({
      name: "John Doe Init",
      email: "init@test.com",
      password: "123",
      address: "Rua XV de Novembro, 1500, Curitiba",
    });
  });
  afterAll(async () => {
    await clearDb();
  });
  afterAll((done) => {
    // Remova async aqui
    closeDb()
      .then(() => {
        done();
      })
      .catch((error) => {
        console.error("Error while closing DB connection:", error);
        done();
      });
  });

  describe("GET /", () => {
    it("should return 200 and Hello World!", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello World!");
    });
  });

  describe("POST /session", () => {
    it("should return 201 and a token", async () => {
      const response = await request(app).post("/session").send({
        email: "init@test.com",
        password: "123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("POST /user", () => {
    it("should return 201 and the created user", async () => {
      const response = await request(app).post("/user").send({
        name: "John Doe",
        email: "test12@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "John Doe");
      expect(response.body).toHaveProperty("_id");
    });
    it("should return 400 if user already exists", async () => {
      const response = await request(app).post("/user").send({
        name: "John Doe",
        email: "init@test.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("eror", "User already exists!");
    });
    it("should return 400 if address or coordinates not provided", async () => {
      const response = await request(app).post("/user").send({
        name: "John Doe",
        email: "test2@email.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "eror",
        "Only one of address or coordinates should be passed!"
      );
    });
    it("should return 400 if address and coordinates are provided", async () => {
      const response = await request(app)
        .post("/user")
        .send({
          name: "John Doe",
          email: "test3@email.com",
          password: "123",
          address: "Rua XV de Novembro, 1500, Curitiba",
          coordinates: [0, 0],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "eror",
        "Only one of address or coordinates should be passed!"
      );
    });
  });

  describe("GET /user", () => {
    it("should return 200 and an array of users", async () => {
      const response = await request(app).get("/user");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /user/:userId", () => {
    it("should return 200 and the user", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "test4@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const response = await request(app).get(`/user/${user.body._id}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "John Doe");
    });
    it("should return 404 if user not found", async () => {
      const response = await request(app).get(`/user/123`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("eror", "User not found!");
    });
  });

  describe("PUT /user/:userId", () => {
    it("should return 201 and the updated user", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "test5@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const response = await request(app).put(`/user/${user.body._id}`).send({
        name: "John Doe Updated",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "John Doe Updated");
    });
  });

  describe("DELETE /user/:userId", () => {
    it("should return 204", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "test6@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const response = await request(app).delete(`/user/${user.body._id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
