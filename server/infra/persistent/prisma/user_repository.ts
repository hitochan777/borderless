import { PrismaClient, User as UserModel } from "@prisma/client";

import { User } from "../../../entity/user";
import { ID } from "../../../types";
import { Language } from "../../../value/language";

export class UserRepository {
  private prismaClient: PrismaClient;
  constructor(driver: PrismaClient) {
    this.prismaClient = driver;
  }

  createEntity(user: UserModel): User {
    return new User(
      user.id,
      user.email,
      user.username,
      this.transformFrom(user.fluentLanguages || ""),
      this.transformFrom(user.learningLanguages || ""),
      user.timezone,
      user.createdAt,
      user.updatedAt
    );
  }

  async findById(id: ID): Promise<User | null> {
    const user = await this.prismaClient.user.findOne({ where: { id } });

    if (user === null) {
      return null;
    }

    return this.createEntity(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = await this.prismaClient.user.findMany({
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
    const user = await this.findById(uid);
    if (user) {
      return user;
    }
    const newUser = new User(uid, "", "", [], [], "");
    return this.create(newUser);
  }

  async createOnlyWithId(uid: ID): Promise<User | null> {
    const newUser = new User(uid, "", "", [], [], "");
    const createdUser = await this.create(newUser);
    return createdUser;
  }

  async create(user: User): Promise<User | null> {
    const createdUser = await this.prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        fluentLanguages: this.transformTo(user.fluentLanguages),
        learningLanguages: this.transformTo(user.learningLanguages)
      }
    });
    return this.createEntity(createdUser);
  }
  async update(uid: string, user: User): Promise<User> {
    const updatedUser = await this.prismaClient.user.update({
      where: {
        id: uid
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
    return languages.map(language => language.code).join(",");
  }
  private transformFrom(languages: string): Language[] {
    return languages.trim().length === 0
      ? []
      : languages.split(",").map(langCode => new Language(langCode));
  }
}
