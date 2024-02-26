import request from "supertest";
import { app } from "../app";
import { close as closeDb } from "../database";

describe("Integration test", () => {
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
        email: "john@example.com",
        password: "123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("GET /user", () => {
    it("should return 200 and an array of users", async () => {
      const response = await request(app).get("/user");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
