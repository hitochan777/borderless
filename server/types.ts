import { ServerResponse } from "http";

import { UserRepository } from "./infra/persistent/prisma/user_repository";
import { PostRepository } from "./infra/persistent/prisma/post_repository";
import { TweetRepository } from "./infra/persistent/prisma/tweet_repository";
import { LineMarkerRepository } from "./infra/persistent/prisma/line_marker_repository";
import { SlateService } from "./infra/service/slate_service";

export interface RepositoryContainer {
  userRepository: UserRepository;
  postRepository: PostRepository;
  tweetRepository: TweetRepository;
  lineMarkerRepository: LineMarkerRepository;
}

export interface ServiceContainer {
  editorService: SlateService;
}

export interface GraphQLContext {
  uid: string | null;
  res: ServerResponse;
  repositories: RepositoryContainer;
  services: ServiceContainer;
}

export type ID = string;
export type NullableID = ID | null;
