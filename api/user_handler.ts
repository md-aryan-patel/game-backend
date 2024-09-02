import { UserStore } from "../db/user";
import { Request, Response } from "express";
import {
  Validate,
  CreateUserParams,
  NewUserFromParameaters,
} from "../types/user";

export class UserHandler {
  userStore: UserStore;

  constructor(userStore: UserStore) {
    this.userStore = userStore;
  }

  HandlePostUser: (req: Request, res: Response) => void = async (req, res) => {
    var param: CreateUserParams = req.body;
    const errors = Validate(param);
    if (Object.keys(errors).length > 0) {
      res.status(400).send({ errors });
      return;
    }
    const user = NewUserFromParameaters(param);
    try {
      const insertedUser = await this.userStore.InsertUser(user);
      res
        .status(201)
        .json({ message: "User created successfully", insertedUser });
    } catch (err) {
      res.status(500).send(err);
    }
  };

  HandleGetUsers: (req: Request, res: Response) => void = async (req, res) => {
    try {
      const users = await this.userStore.GetUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  };
}
