import { ServerResponse } from "http";

import { UserRepository } from "./infra/user_repository";

export interface RepositoryContainer {
  userRepository: UserRepository;
}

export interface GraphQLContext {
  uid: string | null;
  res: ServerResponse;
  repositories: RepositoryContainer;
}

export type ID = number;
