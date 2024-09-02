import { Router } from "express";
import { MongoStore } from "../db/user";
import { AuthHandler } from "../api/auth_handler";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const router: Router = Router();
const clietn = new MongoClient(process.env.MONGO_URL!);
const userSotore = new MongoStore(clietn);

const authHandler = new AuthHandler(userSotore);
router.post("/auth", authHandler.HandleAuthentication);

export default router;
