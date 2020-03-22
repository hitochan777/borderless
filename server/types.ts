import { ServerResponse } from "http";

import {
  UserRepository,
  PostRepository,
  TweetRepository,
  LineMarkerRepository,
  CorrectionGroupRepository
} from "./infra/persistent/prisma";
import { SlateService } from "./infra/service/slate_service";

export interface RepositoryContainer {
  userRepository: UserRepository;
  postRepository: PostRepository;
  tweetRepository: TweetRepository;
  lineMarkerRepository: LineMarkerRepository;
  corretionGroupRepository: CorrectionGroupRepository;
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
