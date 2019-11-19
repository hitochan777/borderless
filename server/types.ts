import { ServerResponse } from "http";

import { UserRepository } from "./infra/user_repository";
import { PostRepository } from "./infra/post_repository";
import { TweetRepository } from "./infra/tweet_repository";
import { LineMarkerRepository } from "./infra/line_marker_repository";
import { SlateService } from "./infra/slate_service";

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

export type ID = number | null;
