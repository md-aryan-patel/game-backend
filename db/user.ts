interface Dropper {
  drop(): void;
}

interface UserStore extends Dropper {
  getUser(): void;
}

class MongoStore implements UserStore {
  drop(): void {
    console.log("MongoStore");
  }

  getUser(): void {
    console.log("MongoStore");
  }
}

const NewMongoStore = (): UserStore => {
  return new MongoStore();
};

module.exports = {
  NewMongoStore,
};
