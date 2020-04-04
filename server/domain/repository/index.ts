export { UserRepository } from "./UserRepository";
export { PostRepository } from "./PostRepository";
export { TweetRepository } from "./TweetRepository";
export { LineMarkerRepository } from "./LineMarkerRepository";
export { CorrectionGroupRepository } from "./CorrectionGroupRepository";

import { UserRepository } from "./UserRepository";
import { PostRepository } from "./PostRepository";
import { TweetRepository } from "./TweetRepository";
import { LineMarkerRepository } from "./LineMarkerRepository";
import { CorrectionGroupRepository } from "./CorrectionGroupRepository";

export interface RepositoryContainer {
  userRepository: UserRepository;
  postRepository: PostRepository;
  tweetRepository: TweetRepository;
  lineMarkerRepository: LineMarkerRepository;
  corretionGroupRepository: CorrectionGroupRepository;
}
