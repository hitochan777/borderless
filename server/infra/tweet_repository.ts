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
    return new Tweet(tweet.id, tweet.userId, [], tweet.inReplyTo, tweet.text, {
      postId: tweet.postId,
      lineNum: tweet.lineNum
    });
  }
  async findTweetForLinesByPostId(id: ID): Promise<Tweet[]> {
    const tweets = await this.tweetForLine().where({
      postId: id
    });
    return tweets.map(tweet => {
      return new Tweet(
        tweet.id,
        tweet.userId,
        [],
        tweet.inReplyTo,
        tweet.text,
        { postId: tweet.postId, lineNum: tweet.lineNum }
      );
    });
  }

  async deleteAllTweetsForLineByPostId(postId: ID) {
    await this.tweetForLine()
      .where({ postId })
      .delete();
  }
}
