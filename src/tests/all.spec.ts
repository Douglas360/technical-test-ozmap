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
    it("should return 404 if user not found", async () => {
      const response = await request(app).delete(`/user/123`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("eror", "User not found!");
    });
  });

  /*TEST REGION ROUTES */

  describe("POST /region", () => {
    it("should return 401 if no token is provided", async () => {
      const response = await request(app)
        .post("/region")
        .send({
          name: "Region 1",
          coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Token is missing");
    });
    it("should return 201 and the created region", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "test7@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      const response = await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "Flórida");
    });
    it("should return 400 if no name is provided", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "noname@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      const response = await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("eror", "Name is required");
    });
  });

  describe("GET /region", () => {
    it("should return 200 and an array of regions", async () => {
      const response = await request(app).get("/region");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /region/:regionId", () => {
    it("should return 201 and the region", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "regionbyid@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      const region = await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });
      const response = await request(app).get(`/region/${region.body._id}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "Flórida");
    });
    it("should return 404 if region not found", async () => {
      const response = await request(app).get(`/region/123`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("eror", "Region not found");
    });
  });

  describe("PUT /region/:regionId", () => {
    it("should return 200 and the updated region", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "putregion@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      const region = await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });

      const response = await request(app)
        .put(`/region/${region.body._id}`)
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida Updated",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Flórida Updated");
    });
  });

  describe("DELETE /region/:regionId", () => {
    it("should return 204", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "delete@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      const region = await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });

      const response = await request(app)
        .delete(`/region/${region.body._id}`)
        .set("Authorization", `Bearer ${session.body.token}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
    it("should return 404 if region not found", async () => {
      const response = await request(app).delete(`/region/123`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("eror", "Region not found");
    });
  });

  describe("GET /regions", () => {
    it("should return 200 and the region", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "getregions@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });
      await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Washington DC",
          user: "65d8d7a22cb94b353c3f965a",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-77.1198, 38.7916],
                [-77.0387, 38.7916],
                [-77.0387, 38.9955],
                [-77.1198, 38.9955],
                [-77.1198, 38.7916],
              ],
            ],
          },
        });

      const response = await request(app).get(
        `/regions?latitude=28.5383&longitude=-81.3792`
      );
      const floridaObject = response.body.find((obj) => obj.name === "Flórida");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(floridaObject).toHaveProperty("name", "Flórida");
    });
  });

  describe("GET /regions/near", () => {
    it("should return 200 and the region", async () => {
      const user = await request(app).post("/user").send({
        name: "John Doe",
        email: "getregionsnear@email.com",
        password: "123",
        address: "Rua XV de Novembro, 1500, Curitiba",
      });

      const session = await request(app).post("/session").send({
        email: user.body.email,
        password: "123",
      });

      await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Flórida",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.87, 24.54],
                [-87.63, 24.54],
                [-87.63, 31],
                [-80.87, 31],
                [-80.87, 24.54],
              ],
            ],
          },
        });
      await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "Washington DC",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-77.1198, 38.7916],
                [-77.0387, 38.7916],
                [-77.0387, 38.9955],
                [-77.1198, 38.9955],
                [-77.1198, 38.7916],
              ],
            ],
          },
        });
      await request(app)
        .post("/region")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "New York",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-74.2591, 40.4774],
                [-73.7002, 40.4774],
                [-73.7002, 40.9176],
                [-74.2591, 40.9176],
                [-74.2591, 40.4774],
              ],
            ],
          },
        });

      const response = await request(app).get(
        `/regions/near?latitude=40.7128&longitude=-74.0060&maxDistance=100000&userId=${user.body._id}`
      );
      const newYorkObject = response.body.find(
        (obj) => obj.name === "New York"
      );

      expect(newYorkObject).toHaveProperty("name", "New York");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
    it("should return 400 if no userId is provided", async () => {
      const response = await request(app).get(
        `/regions/near?latitude=40.7128&longitude=-74.0060&maxDistance=100000`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("eror", "User ID is required");
    });
  });
});
