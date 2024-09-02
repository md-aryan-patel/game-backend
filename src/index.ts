import express, { Express } from "express";
import dotenv from "dotenv";
import userRouter from "../routes/user_routes";
import authRouter from "../routes/auth_router";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/v1", userRouter);
app.use("/api", authRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
