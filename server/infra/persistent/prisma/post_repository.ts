import {
  PrismaClient,
  Post as PostModel,
  User as UserModel,
} from "@prisma/client";

import { Post } from "../../../entity/post";
import { ID } from "../../../types";
import { Language } from "../../../value/language";
import { PostRepository } from "../../../domain/repository";

export class PrismaPostRepository implements PostRepository {
  private photon: PrismaClient;
  constructor(driver: PrismaClient) {
    this.photon = driver;
  }

  createEntity(post: PostModel & { user: UserModel }): Post {
    return new Post(
      post.id,
      post.user.id,
      new Language(post.language),
      JSON.parse(post.content),
      !post.published,
      post.createdAt,
      post.updatedAt
    );
  }

  async create(postInput: Post): Promise<Post | null> {
    if (postInput.userId === null) {
      throw new Error("You cannot set userId to null");
    }
    const repliable = await this.photon.repliable.create({ data: {} });
    const newPost = await this.photon.post.create({
      data: {
        id: repliable.id,
        user: {
          connect: {
            id: postInput.userId,
          },
        },
        language: postInput.language.code,
        published: !postInput.isDraft,
        content: "{}",
      },
      include: {
        user: true,
      },
    });
    return this.createEntity(newPost);
  }
  async update(post: Post): Promise<Post> {
    if (!post.id) {
      throw new Error("ID is not set");
    }
    if (!post.userId) {
      throw new Error("You cannot set userId to null");
    }
    if (post.lines.some((line) => line.isNotPersisted())) {
      throw new Error("Line ID should not be null during update");
    }

    const contentString = JSON.stringify(post.lines);

    const updatedPost = await this.photon.post.update({
      where: {
        id: post.id,
      },
      data: {
        user: {
          connect: {
            id: post.userId,
          },
        },
        language: post.language.code,
        content: contentString,
        published: !post.isDraft,
      },
      include: {
        user: true,
      },
    });

    return this.createEntity(updatedPost);
  }

  async findByUser(userId: ID): Promise<Post[]> {
    const posts = await this.photon.post.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map((post) => this.createEntity(post));
  }

  async findById(id: ID): Promise<Post | null> {
    const post = await this.photon.post.findOne({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (post === null) {
      return null;
    }
    return this.createEntity(post);
  }

  async findAll(currentUserId: ID = ""): Promise<Post[]> {
    const posts = await this.photon.post.findMany({
      where: {
        OR: [
          {
            published: true,
          },
          {
            published: false,
            user: {
              id: currentUserId,
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
    return posts.map((post) => this.createEntity(post));
  }

  async findByLanguages(
    langs: Language[],
    currentUserId: ID = "",
    { offset = 0, limit = 20 } = { offset: 0, limit: 20 }
  ): Promise<Post[]> {
    const conditions: any[] = [
      {
        OR: [
          {
            published: true,
          },
          {
            published: false,
            user: {
              id: currentUserId,
            },
          },
        ],
      },
    ];
    if (langs.length > 0) {
      conditions.push({
        language: {
          in: langs.map((lang) => lang.code),
        },
      });
    }
    const posts = await this.photon.post.findMany({
      where: {
        AND: conditions,
      },
      include: {
        user: true,
      },
      skip: offset,
      first: limit,
      orderBy: {
        updatedAt: "desc",
      },
    });
    return posts.map((post) => this.createEntity(post));
  }

  async toggleLike(userId: ID, postId: ID): Promise<void> {
    const likes = await this.photon.like.findMany({
      where: {
        repliable: {
          id: postId,
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
              id: postId,
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

  async countLike(postId: ID): Promise<number> {
    const likes = await this.photon.like.findMany({
      where: { repliable: { id: postId } },
    }); // FIXME: use count method when it becomes available
    return likes.length;
  }

  async likedByMe(userId: ID, postId: ID): Promise<boolean> {
    const likes = await this.photon.like.findMany({
      where: { user: { id: userId }, repliable: { id: postId } },
    });
    return likes.length > 0;
  }
}
