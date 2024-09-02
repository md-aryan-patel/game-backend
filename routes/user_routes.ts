import { Router } from "express";
import { MongoStore } from "../db/user";
import { UserHandler } from "../api/user_handler";
import { MongoClient } from "mongodb";
import { JWTAuthentication } from "../api/middleware/jwt";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();
const clietn = new MongoClient(process.env.MONGO_URL!);
const userSotore = new MongoStore(clietn);
const userHandler = new UserHandler(userSotore);

router.use(JWTAuthentication(userSotore));
router.post("/user", userHandler.HandlePostUser);
router.get("/users", userHandler.HandleGetUsers);

export default router;
