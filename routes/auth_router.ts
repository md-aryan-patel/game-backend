import { Router } from "express";
import dotenv from "dotenv";
import { AuthHandlerSingleton } from "../instances/singleton";
dotenv.config();

const router: Router = Router();

const authHandler = AuthHandlerSingleton.getInstance();

router.post("/auth", authHandler.HandleAuthentication);

export default router;
