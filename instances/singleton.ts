import { MongoStore } from "../db/user";
import { UserHandler } from "../api/user_handler";
import { MongoClient } from "mongodb";
import { AuthHandler } from "../api/auth_handler";

export class MongoClientSingleton {
  private static mongoClient: MongoClient;

  static getInstance(): MongoClient {
    if (!MongoClientSingleton.mongoClient) {
      MongoClientSingleton.mongoClient = new MongoClient(
        process.env.MONGO_URL!
      );
    }
    return MongoClientSingleton.mongoClient;
  }
}

export class UserStoreSingleton {
  private static userStore: MongoStore;

  private constructor() {}

  static getInstance(): MongoStore {
    if (!UserStoreSingleton.userStore) {
      const client = MongoClientSingleton.getInstance();
      UserStoreSingleton.userStore = new MongoStore(client);
    }
    return UserStoreSingleton.userStore;
  }
}

export class UserHandlerSingleton {
  private static userHandler: UserHandler;

  private constructor() {}

  static getInstance(): UserHandler {
    if (!UserHandlerSingleton.userHandler) {
      const userStore = UserStoreSingleton.getInstance();
      UserHandlerSingleton.userHandler = new UserHandler(userStore);
    }
    return UserHandlerSingleton.userHandler;
  }
}

export class AuthHandlerSingleton {
  private static authHandler: AuthHandler;

  private constructor() {}

  static getInstance(): AuthHandler {
    if (!AuthHandlerSingleton.authHandler) {
      const userStore = UserStoreSingleton.getInstance();
      AuthHandlerSingleton.authHandler = new AuthHandler(userStore);
    }
    return AuthHandlerSingleton.authHandler;
  }
}
