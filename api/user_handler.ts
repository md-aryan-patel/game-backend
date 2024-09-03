import { UserStore } from "../db/user";
import { Request, Response } from "express";

export class UserHandler {
  userStore: UserStore;

  constructor(userStore: UserStore) {
    this.userStore = userStore;
  }

  HandleGetUsers: (req: Request, res: Response) => void = async (req, res) => {
    try {
      const users = await this.userStore.GetUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  };

  HandleDeleteUser: (req: Request, res: Response) => void = async (
    req,
    res
  ) => {
    try {
      const id = req.params.id;
      const user = await this.userStore.DeleteUser(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  };
}
