import knex from "knex";

import { User } from "../entity/user";
import { Language } from "../value/language";
import { ID } from "../types";

interface RawUser {
  id: number;
  uid: string;
  email: string;
  username: string;
  fluentLanguages: string;
  learningLanguages: string;
}

type UserInput = Partial<
  Pick<
    User,
    "uid" | "email" | "username" | "fluentLanguages" | "learningLanguages"
  >
>;

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
      user.uid,
      user.email,
      user.username,
      this.transformFrom(user.fluentLanguages),
      this.transformFrom(user.learningLanguages)
    );
  }
  async findById(id: ID): Promise<User | null> {
    const user = await this.users()
      .where("id", id)
      .first();
    if (!user) {
      return null;
    }
    return new User(
      user.id,
      user.uid,
      user.email,
      user.username,
      this.transformFrom(user.fluentLanguages),
      this.transformFrom(user.learningLanguages)
    );
  }

  async findByIdOrCreate(uid: string): Promise<User | null> {
    const user = await this.findByUid(uid);
    if (user) {
      return user;
    }
    return this.create({ uid });
  }
  async create({
    uid = "",
    email = "",
    username = "",
    fluentLanguages = [],
    learningLanguages = []
  }: UserInput): Promise<User | null> {
    const ids = await this.users().insert({
      uid,
      email,
      username,
      fluentLanguages: this.transformTo(fluentLanguages),
      learningLanguages: this.transformTo(learningLanguages)
    });
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
      user.uid,
      user.email,
      user.username,
      this.transformFrom(user.fluentLanguages),
      this.transformFrom(user.learningLanguages)
    );
  }
  async update(
    uid: string,
    {
      email = "",
      username = "",
      fluentLanguages = [],
      learningLanguages = []
    }: Omit<UserInput, "uid">
  ): Promise<User | null> {
    const newUserInput = {
      email,
      username,
      fluentLanguages: this.transformTo(fluentLanguages),
      learningLanguages: this.transformTo(learningLanguages)
    } as Omit<RawUser, "uid">;
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
    return new User(user.id, user.uid, user.email, user.username, [], []);
  }

  private transformTo(languages: Language[]): string {
    return languages.join(",");
  }
  private transformFrom(languages: string): Language[] {
    return languages.trim().length === 0
      ? []
      : languages.split(",").map(langId => +langId);
  }
}
