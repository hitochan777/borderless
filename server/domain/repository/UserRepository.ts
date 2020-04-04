import { User } from "../../entity/user";
import { ID } from "../../types";

export interface UserRepository {
  findById(id: ID): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByIdOrCreate(uid: string): Promise<User | null>;
  createOnlyWithId(uid: ID): Promise<User | null>;
  create(user: User): Promise<User | null>;
  update(uid: string, user: User): Promise<User>;
}
