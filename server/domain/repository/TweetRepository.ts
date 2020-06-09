import { Tweet } from "../../entity/tweet";
import { ID } from "../../types";

export interface TweetRepository {
  create(tweet: Tweet): Promise<Tweet>;
  createMany(tweets: Tweet[]): Promise<Tweet[]>;
  delete(tweetId: ID): Promise<void>;
  findOneById(id: ID): Promise<Tweet | null>;
  findManyByIds(ids: ID[]): Promise<Tweet[]>;
  findRepliesTo(repliableId: ID): Promise<Tweet[]>;
  toggleLike(userId: ID, tweetId: ID): Promise<void>;
  countLike(tweetId: ID): Promise<number>;
  likedByMe(userId: ID, tweetId: ID): Promise<boolean>;
}
