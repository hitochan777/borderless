import {
  Photon,
  Tweet as TweetModel,
  Post as PostModel,
  Repliable as RepliableModel,
  User as UserModel
} from "@prisma/photon";

import { Tweet } from "../../../entity/tweet";
import { ID } from "../../../types";

export class TweetRepository {
  private photon: Photon;
  constructor() {
    this.photon = new Photon();
  }

  async create({
    userId,
    postId,
    text,
    inReplyTo
  }: {
    userId: ID;
    postId: ID;
    text: string;
    inReplyTo: ID;
  }) {
    if (userId === null) {
      throw new Error("user ID is not set");
    }
    if (postId === null) {
      throw new Error("post ID is not set");
    }
    const repliable = await this.photon.repliables.create({ data: {} });
    const createdTweet = await this.photon.tweets.create({
      data: {
        id: repliable.id,
        user: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: postId
          }
        },
        inReplyTo: {
          connect: {
            id: inReplyTo
          }
        },
        content: text
      },
      include: {
        user: true,
        post: true,
        inReplyTo: true
      }
    });

    return this.createEntity(createdTweet);
  }

  async findTweetById(id: ID): Promise<Tweet | null> {
    const tweet = await this.photon.tweets.findOne({
      where: { id },
      include: { post: true, inReplyTo: true, user: true }
    });
    if (tweet === null) {
      return null;
    }
    return this.createEntity(tweet);
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
      tweet.createdAt,
      tweet.updatedAt
    );
  }

  async findRepliesTo(repliableId: ID): Promise<Tweet[]> {
    const rawReplies = await this.photon.tweets.findMany({
      where: {
        inReplyTo: {
          id: repliableId
        }
      },
      include: { post: true, inReplyTo: true, user: true }
    });
    return rawReplies.map(reply => this.createEntity(reply));
  }

  async addLike(userId: ID, tweetId: ID) {
    await this.photon.likes.create({
      data: {
        repliable: {
          connect: {
            id: tweetId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  async countLike(userId: ID, tweetId: ID): Promise<number> {
    const likes = await this.photon.likes.findMany({
      where: { user: { id: userId }, repliable: { id: tweetId } }
    }); // FIXME: use count method when it becomes available
    return likes.length;
  }

  async likedByMe(userId: ID, tweetId: ID): Promise<boolean> {
    const likes = await this.photon.likes.findMany({
      where: { user: { id: userId }, repliable: { id: tweetId } }
    });
    return likes.length > 0;
  }
}
