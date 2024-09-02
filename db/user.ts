import { MongoClient, Collection, ObjectId } from "mongodb";
import { User } from "../types/user";
import { DBNAME } from "../helper";

export interface UserStore {
  InsertUser(user: User): Promise<User>;
  GetUsers(): Promise<User[]>;
  GetUserByID(id: string): Promise<User>;
  GetUserByEmail(email: string): Promise<User>;
  DeleteUser(id: string): Promise<User>;
  Drop(): void;
}

export class MongoStore implements UserStore {
  client: MongoClient;
  collection: Collection;

  constructor(client: MongoClient) {
    this.client = client;
    this.collection = this.client.db(DBNAME).collection("users");
  }

  async InsertUser(user: User): Promise<User> {
    try {
      await this.client.connect();
      const res = await this.collection.insertOne(user);
      user.id = res.insertedId;
    } catch (err) {
      throw err;
    }
    await this.client.close();
    return user;
  }

  async GetUsers(): Promise<User[]> {
    await this.client.connect();
    const res = await this.collection.find().toArray();
    const users: User[] = [];

    for (const user of res) {
      users.push({
        id: user._id,
        name: user.name,
        email: user.email,
        encryptedPassword: user.encryptedPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        IsAdmin: user.IsAdmin,
      });
    }
    await this.client.close();
    return users;
  }

  async GetUserByID(id: string): Promise<User> {
    await this.client.connect();
    const res = await this.collection.findOne({ _id: new ObjectId(id) });
    if (res) {
      return {
        id: res._id,
        name: res.name,
        email: res.email,
        encryptedPassword: res.encryptedPassword,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        IsAdmin: res.IsAdmin,
      };
    }
    await this.client.close();
    throw new Error("user not found");
  }

  async GetUserByEmail(email: string): Promise<User> {
    await this.client.connect();
    const res = await this.collection.findOne({ email: email });
    if (res) {
      return {
        id: res._id,
        name: res.name,
        email: res.email,
        encryptedPassword: res.encryptedPassword,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        IsAdmin: res.IsAdmin,
      };
    }
    await this.client.close();
    throw new Error("user not found");
  }

  async DeleteUser(id: string): Promise<User> {
    await this.client.connect();
    const res = await this.collection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (res) {
      return {
        id: res._id,
        name: res.name,
        email: res.email,
        encryptedPassword: res.encryptedPassword,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        IsAdmin: res.IsAdmin,
      };
    }
    await this.client.close();
    throw new Error("user not found");
  }

  Drop(): void {
    console.log("____dropping the user collection____");
    this.collection.drop();
  }
}
