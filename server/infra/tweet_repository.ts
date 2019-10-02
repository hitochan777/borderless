import knex from "knex";

import { Tweet } from "../entity/tweet";
import { ID } from "../types";

interface RawTweet {
  id: ID;
  userId: ID;
  text: string;
  inReplyTo: ID;
}

interface RawTweetForLine {
  id: ID;
  postId: ID;
  lineNum: number;
  userId: ID;
  text: string;
  inReplyTo: ID;
}

interface RawRepliable {
  id: ID;
}

interface TweetForLineInput {
  userId: ID;
  text: string;
  postId: ID;
  lineNum: number;
}

const isRawTweetForLine = (
  tweet: RawTweet | RawTweetForLine
): tweet is RawTweetForLine => {
  return (
    (tweet as RawTweetForLine).postId !== undefined &&
    (tweet as RawTweetForLine).lineNum !== undefined
  );
};

export class TweetRepository {
  tweets: () => knex.QueryBuilder<RawTweet, RawTweet[]>;
  tweetForLine: () => knex.QueryBuilder<RawTweetForLine, RawTweetForLine[]>;
  repliables: () => knex.QueryBuilder<RawRepliable, RawRepliable[]>;
  constructor(db: knex) {
    this.tweets = () => db("tweet");
    this.repliables = () => db("repliable");
    this.tweetForLine = () => db("tweet_for_line");
  }
  async createTweetForLine({
    userId,
    text,
    postId,
    lineNum
  }: TweetForLineInput) {
    const repliableIds = await this.repliables().insert({});
    if (repliableIds.length == 0) {
      return null;
    }
    const ids = await this.tweetForLine().insert({
      id: repliableIds[0],
      userId,
      text,
      postId,
      lineNum
    });
    if (ids.length === 0) {
      return null;
    }
    const tweet = await this.tweetForLine()
      .where("id", ids[0])
      .first();
    if (!tweet) {
      return null;
    }
    return TweetRepository.mapDBResultToEntity(tweet);
  }

  async findTweetForLinesByPostId(id: ID): Promise<Tweet[]> {
    const tweets = await this.tweetForLine().where({
      postId: id
    });
    return tweets.map(tweet => TweetRepository.mapDBResultToEntity(tweet));
  }

  async deleteAllTweetsForLineByPostId(postId: ID) {
    await this.tweetForLine()
      .where({ postId })
      .delete();
  }

  static mapDBResultToEntity(dbTweet: RawTweet | RawTweetForLine): Tweet {
    let lineRef = undefined;
    if (isRawTweetForLine(dbTweet)) {
      lineRef = { postId: dbTweet.postId, lineNum: dbTweet.lineNum };
    }

    return new Tweet(
      dbTweet.id,
      dbTweet.userId,
      dbTweet.inReplyTo,
      dbTweet.text,
      lineRef
    );
  }

  async findRepliesTo(repliableId: ID): Promise<Tweet[]> {
    // no need to search tweet4lines because tweets for lines should always be the root of a thread
    const rawReplies = await this.tweets().where({ inReplyTo: repliableId });
    return rawReplies.map(reply => TweetRepository.mapDBResultToEntity(reply));
  }
}
