import knex from "knex";

import { Tweet } from "../entity/tweet";
import { ID } from "../types";

interface RawTweet {
  id: ID;
  userId: ID;
  postId: ID;
  text: string;
  inReplyTo: ID;
}

interface RawRepliable {
  id: ID;
}

export class TweetRepository {
  tweets: () => knex.QueryBuilder<RawTweet, RawTweet[]>;
  repliables: () => knex.QueryBuilder<RawRepliable, RawRepliable[]>;
  constructor(db: knex) {
    this.tweets = () => db("tweet");
    this.repliables = () => db("repliable");
  }

  async findTweetById(id: ID): Promise<Tweet | null> {
    const tweets = await this.tweets().where({
      id
    });
    if (tweets.length > 1) {
      throw new Error("multiple tweet with the same ID found");
    }
    if (tweets.length === 1) {
      return TweetRepository.mapDBResultToEntity(tweets[0]);
    }
    return null;
  }

  static mapDBResultToEntity(dbTweet: RawTweet): Tweet {
    return new Tweet(
      dbTweet.id,
      dbTweet.userId,
      dbTweet.inReplyTo,
      dbTweet.postId,
      dbTweet.text
    );
  }

  async findRepliesTo(repliableId: ID): Promise<Tweet[]> {
    // no need to search tweet4lines because tweets for lines should always be the root of a thread
    const rawReplies = await this.tweets().where({ inReplyTo: repliableId });
    return rawReplies.map(reply => TweetRepository.mapDBResultToEntity(reply));
  }
}
