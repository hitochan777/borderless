import knex from "knex";

import { User } from "../entity/user";

const ALL_FIELDS = [
  "uid",
  "username",
  "email, fluentLanguages",
  "learningLanguages"
];

interface RawUser {
  id: number;
  uid: string;
  email: string;
  username: string;
  fluentLanguages: string;
  learningLanguages: string;
}

export class UserRepository {
  users: () => knex.QueryBuilder<RawUser, RawUser[]>;
  constructor(db: knex) {
    this.users = () => db("user");
  }
  async findByUid(uid: string): Promise<User | null> {
    const user = await this.users()
      .where("uid", uid)
      .first();
    if (!user) {
      return null;
    }
    return new User(
      user.id,
      user.email,
      user.username,
      [], // TODO
      [] // TODO
    );
  }
  async findByIdOrCreate(uid: string): Promise<User | null> {
    const user = await this.findByUid(uid);
    if (user) {
      return user;
    }
    return this.create(uid);
  }
  async create(uid: string): Promise<User | null> {
    const ids = await this.users().insert(
      {
        uid,
        email: "",
        username: "",
        fluentLanguages: "",
        learningLanguages: ""
      },
      ALL_FIELDS
    );
    if (ids.length === 0) {
      return null;
    }
    const user = await this.users()
      .where("id", ids[0])
      .first();
    if (!user) {
      return null;
    }
    return new User(
      user.id,
      user.email,
      user.username,
      [], // TODO
      [] // TODO
    );
  }
  async update(
    uid: string,
    userInput: {
      email?: string | null;
      username?: string | null;
      fluentLanguages?: string[] | null;
      learningLanguages?: string[] | null;
    }
  ): Promise<User | null> {
    let newUserInput = {
      email: userInput.email,
      username: userInput.username
    } as Omit<RawUser, "uid">;
    if (userInput.fluentLanguages) {
      newUserInput.fluentLanguages = userInput.fluentLanguages.join(",");
    }
    if (userInput.learningLanguages) {
      newUserInput.learningLanguages = userInput.learningLanguages.join(",");
    }
    const numUpdated = await this.users()
      .where("uid", uid)
      .update(newUserInput);

    if (numUpdated === 0) {
      return null;
    }

    const user = await this.users()
      .where("uid", uid)
      .first();
    if (!user) {
      return null;
    }
    return new User(user.id, user.email, user.username, [], []);
  }
}
