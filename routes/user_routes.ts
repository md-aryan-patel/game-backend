import { Router } from "express";
import { JWTAuthentication } from "../api/middleware/jwt";
import dotenv from "dotenv";
import {
  UserHandlerSingleton,
  UserStoreSingleton,
} from "../instances/singleton";

dotenv.config();

const router: Router = Router();
const userStore = UserStoreSingleton.getInstance();
const userHandler = UserHandlerSingleton.getInstance();

router.use(JWTAuthentication(userStore));
router.post("/user", userHandler.HandlePostUser);
router.get("/users", userHandler.HandleGetUsers);
router.delete("/user/:id", userHandler.HandleDeleteUser);

export default router;
