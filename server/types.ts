import { ServerResponse } from "http";
import { Repository } from "typeorm";

import { User } from "./entity/user";
import { Post } from "./entity/post";

export interface RepositoryContainer {
  userRepository: Repository<User>;
  postRepository: Repository<Post>;
}

export interface GraphQLContext {
  uid: string | null;
  res: ServerResponse;
  repositories: RepositoryContainer;
}

export type ID = number;
