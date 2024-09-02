import jwt = require("jsonwebtoken");
import { UserStore } from "../db/user";
import { IsValidPassword, User } from "../types/user";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export class AuthHandler {
  userStore: UserStore;
  constructor(userStore: UserStore) {
    this.userStore = userStore;
  }
  HandleAuthentication: (req: Request, res: Response) => void = async (
    req,
    res
  ) => {
    let authParams: AuthParams;
    let user: User;
    authParams = req.body;

    try {
      user = await this.userStore.GetUserByEmail(authParams.email);
      const isValidPass = IsValidPassword(
        authParams.password,
        user.encryptedPassword
      );
      if (!isValidPass) {
        return res.status(401).send("Incorrect password");
      }
      const response = new AuthResponse(user, createTokenFromUser(user));
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).send(err);
    }
  };
}

interface AuthParams {
  email: string;
  password: string;
}

class AuthResponse {
  user: User;
  token: string;
  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }
}

const createTokenFromUser = (user: User): string => {
  const now = new Date();
  const expires = new Date(now.getTime() + 1 * 60 * 60 * 1000);
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expires.getTime() - now.getTime(),
  });

  return token;
};
