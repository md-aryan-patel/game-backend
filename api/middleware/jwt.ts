import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserStore } from "../../db/user";
import dotenv from "dotenv";
dotenv.config();

type validTokenResponse = Promise<{ id: string; expires: number }>;

export function JWTAuthentication(userStore: UserStore) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-api-token"];

    if (!token) {
      return res.status(401).json({ error: "[server]: token not found" });
    }

    try {
      const claims = await validateToken(token as string);

      if (Date.now() >= claims.expires * 1000) {
        return res.status(401).json({ error: "Token expired" });
      }

      const user = await userStore.GetUserByID(claims.id);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Set the current authenticated user to the request object
      //   req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: err });
    }
  };
}

async function validateToken(tokenString: string): validTokenResponse {
  const token = jwt.verify(tokenString, process.env.JWT_SECRET as string);

  if (!token || typeof token !== "object") {
    throw new Error("Unauthorized");
  }

  const result = token as JwtPayload;
  return { id: result.userId, expires: result.exp! };
}
