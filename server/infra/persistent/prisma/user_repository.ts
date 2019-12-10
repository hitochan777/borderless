import { Photon, User as UserModel } from "@prisma/photon";

import { User } from "../../../entity/user";
import { ID } from "../../../types";
import { Language } from "../../../value/language";

export class UserRepository {
  private photon: Photon;
  constructor() {
    this.photon = new Photon();
  }

  createEntity(user: UserModel) {
    return new User(
      user.id,
      user.uid,
      user.email,
      user.username,
      this.transformFrom(user.fluentLanguages || ""),
      this.transformFrom(user.learningLanguages || ""),
      user.createdAt,
      user.updatedAt
    );
  }

  async findByUid(uid: string): Promise<User | null> {
    const user = await this.photon.users.findOne({ where: { uid } });

    if (user === null) {
      return null;
    }

    return this.createEntity(user);
  }
  async findById(id: ID): Promise<User | null> {
    const user = await this.photon.users.findOne({ where: { id } });

    if (user === null) {
      return null;
    }

    return this.createEntity(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = await this.photon.users.findMany({
      where: {
        username
      }
    });

    if (users.length > 1) {
      throw new Error("Multiple users found");
    }
    if (users.length === 0) {
      return null;
    }

    return this.createEntity(users[0]);
  }

  async findByIdOrCreate(uid: string): Promise<User | null> {
    const user = await this.findByUid(uid);
    if (user) {
      return user;
    }
    const newUser = new User(null, uid, "", "", [], []);
    return this.create(newUser);
  }

  async createOnlyWithUid(uid: ID): Promise<User | null> {
    const newUser = new User(null, uid, "", "", [], []);
    const createdUser = await this.create(newUser);
    return createdUser;
  }

  async create(user: User): Promise<User | null> {
    const createdUser = await this.photon.users.create({
      data: {
        uid: user.uid,
        email: user.email,
        username: user.username,
        fluentLanguages: this.transformTo(user.fluentLanguages),
        learningLanguages: this.transformTo(user.learningLanguages)
      }
    });
    return this.createEntity(createdUser);
  }
  async update(uid: string, user: User): Promise<User | null> {
    const updatedUser = await this.photon.users.update({
      where: {
        uid
      },
      data: {
        email: user.email,
        username: user.username,
        fluentLanguages: this.transformTo(user.fluentLanguages),
        learningLanguages: this.transformTo(user.learningLanguages)
      }
    });

    return this.createEntity(updatedUser);
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
