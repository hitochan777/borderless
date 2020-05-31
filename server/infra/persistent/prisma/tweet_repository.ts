import {
  PrismaClient,
  Tweet as TweetModel,
  Post as PostModel,
  Repliable as RepliableModel,
  User as UserModel,
} from "@prisma/client";

import { Tweet } from "../../../entity/tweet";
import { ID } from "../../../types";
import { TweetRepository } from "../../../domain/repository";

export class PrismaTweetRepository implements TweetRepository {
  private photon: PrismaClient;
  constructor(driver: PrismaClient) {
    this.photon = driver;
  }

  async create(tweet: Tweet): Promise<Tweet> {
    if (tweet.userId === null) {
      throw new Error("user ID is not set");
    }
    if (tweet.postId === null) {
      throw new Error("post ID is not set");
    }
    const repliable = await this.photon.repliable.create({ data: {} });
    const createdTweet = await this.photon.tweet.create({
      data: {
        id: repliable.id,
        user: {
          connect: {
            id: tweet.userId,
          },
        },
        post: {
          connect: {
            id: tweet.postId,
          },
        },
        inReplyTo: {
          connect: {
            id: tweet.inReplyTo,
          },
        },
        content: tweet.text,
        correction: tweet.correction,
      },
      include: {
        user: true,
        post: true,
        inReplyTo: true,
      },
    });

    return this.createEntity(createdTweet);
  }

  async createMany(tweets: Tweet[]): Promise<Tweet[]> {
    const promises = [];
    for (const tweet of tweets) {
      // FIXME: bulk insert is preferred but no way to do this at this moment
      promises.push(this.create(tweet));
    }
    return Promise.all(promises);
  }

  async findOneById(id: ID): Promise<Tweet | null> {
    const tweet = await this.photon.tweet.findOne({
      where: { id },
      include: { post: true, inReplyTo: true, user: true },
    });
    if (tweet === null) {
      return null;
    }
    return this.createEntity(tweet);
  }

  async findManyByIds(ids: ID[]): Promise<Tweet[]> {
    const tweets = await this.photon.tweet.findMany({
      where: { id: { in: ids } },
      include: { post: true, inReplyTo: true, user: true },
    });
    return tweets.map((tweet) => this.createEntity(tweet));
  }

  createEntity(
    tweet: TweetModel & {
      user: UserModel;
      post: PostModel;
      inReplyTo: RepliableModel;
    }
  ): Tweet {
    return new Tweet(
      tweet.id,
      tweet.user.id,
      tweet.inReplyTo.id,
      tweet.post.id,
      tweet.content,
      tweet.correction,
      tweet.createdAt,
      tweet.updatedAt
    );
  }

  async findRepliesTo(repliableId: ID): Promise<Tweet[]> {
    const rawReplies = await this.photon.tweet.findMany({
      where: {
        inReplyTo: {
          id: repliableId,
        },
      },
      include: { post: true, inReplyTo: true, user: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return rawReplies.map((reply) => this.createEntity(reply));
  }

  async toggleLike(userId: ID, tweetId: ID): Promise<void> {
    const likes = await this.photon.like.findMany({
      where: {
        repliable: {
          id: tweetId,
        },
        user: {
          id: userId,
        },
      },
    });
    if (likes.length > 1) {
      throw new Error("Multiple likes by the same user found");
    }
    if (likes.length === 1) {
      await this.photon.like.delete({
        where: {
          id: likes[0].id,
        },
      });
    } else {
      await this.photon.like.create({
        data: {
          repliable: {
            connect: {
              id: tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }
  }

  async countLike(tweetId: ID): Promise<number> {
    return await this.photon.like.count({
      where: { repliable: { id: tweetId } },
    });
  }

  async likedByMe(userId: ID, tweetId: ID): Promise<boolean> {
    const likes = await this.photon.like.findMany({
      where: { user: { id: userId }, repliable: { id: tweetId } },
    });
    return likes.length > 0;
  }
}
