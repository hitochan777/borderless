import { ServerResponse } from "http";

import { UserRepository } from "./infra/user_repository";
import { PostRepository } from "./infra/post_repository";

export interface RepositoryContainer {
  userRepository: UserRepository;
  postRepository: PostRepository;
}

export interface GraphQLContext {
  uid: string | null;
  res: ServerResponse;
  repositories: RepositoryContainer;
}

export type ID = number;
