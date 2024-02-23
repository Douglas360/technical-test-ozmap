import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { UserService } from "./services/UserService";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/user", userController.createUser);
router.get("/user", userController.getAllUsers);
router.get("/user/:userId", userController.getUserById);

export { router };
