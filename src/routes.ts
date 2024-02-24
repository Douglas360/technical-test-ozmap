import { Router } from "express";
import { auth } from "./middleware/auth";
import { SessionController } from "./controllers/SessionController";
import { UserController } from "./controllers/UserController";
import { UserService } from "./services/UserService";
import { RegionController } from "./controllers/RegionController";
import { RegionService } from "./services/RegionService";

const router = Router();
const sessionController = new SessionController();
const userService = new UserService();
const userController = new UserController(userService);

const regionService = new RegionService();
const regionController = new RegionController(regionService);

/*Rotas para sessão */
router.post("/session", sessionController.create);

/*Rotas para usuário */
router.post("/user", userController.createUser);
router.get("/user", userController.getAllUsers);
router.get("/user/:userId", userController.getUserById);
router.put("/user/:userId", userController.updateUser);
router.delete("/user/:userId", userController.deleteUser);

/*Rotas para região */
//utiliza o middleware de autenticação na rota de criação de região
router.post("/region", auth, regionController.createRegion);
router.get("/region", regionController.getAllRegions);
router.get("/region/:regionId", regionController.getRegionById);
router.put("/region/:regionId", regionController.updateRegion);
router.delete("/region/:regionId", regionController.deleteRegion);
router.get("/regions", regionController.getRegionContainingCoordinates);
router.get("/regions/near", regionController.getRegionNearCoordinates);

export { router };
