import { Photon, Post as PostModel, User as UserModel } from "@prisma/photon";

import { Post } from "../../../entity/post";
import { ID } from "../../../types";
import { Language } from "../../../value/language";

export class PostRepository {
  private photon: Photon;
  constructor() {
    this.photon = new Photon();
  }

  createEntity(post: PostModel & { user: UserModel }): Post {
    return new Post(
      post.id,
      post.user.id,
      post.language,
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
    const repliable = await this.photon.repliables.create({ data: {} });
    const newPost = await this.photon.posts.create({
      data: {
        id: repliable.id,
        user: {
          connect: {
            id: postInput.userId
          }
        },
        language: postInput.language,
        published: !postInput.isDraft,
        content: "{}"
      },
      include: {
        user: true
      }
    });
    return this.createEntity(newPost);
  }
  async update(post: Post) {
    if (!post.id) {
      throw new Error("ID is not set");
    }
    if (!post.userId) {
      throw new Error("You cannot set userId to null");
    }
    if (post.lines.some(line => line.isNotPersisted())) {
      throw new Error("Line ID should not be null during update");
    }

    const contentString = JSON.stringify(post.lines);

    const updatedPost = await this.photon.posts.update({
      where: {
        id: post.id
      },
      data: {
        user: {
          connect: {
            id: post.userId
          }
        },
        language: post.language,
        content: contentString,
        published: !post.isDraft
      },
      include: {
        user: true
      }
    });

    return this.createEntity(updatedPost);
  }

  async findByUser(userId: ID): Promise<Post[]> {
    const posts = await this.photon.posts.findMany({
      where: {
        user: {
          id: userId
        }
      },
      include: {
        user: true
      }
    });

    return posts.map(post => this.createEntity(post));
  }

  async findById(id: ID): Promise<Post | null> {
    const post = await this.photon.posts.findOne({
      where: {
        id
      },
      include: {
        user: true
      }
    });
    if (post === null) {
      return null;
    }
    return this.createEntity(post);
  }

  async findAll(currentUserId: ID = ""): Promise<Post[]> {
    const posts = await this.photon.posts.findMany({
      where: {
        OR: [
          {
            published: true
          },
          {
            published: false,
            user: {
              id: currentUserId
            }
          }
        ]
      },
      include: {
        user: true
      }
    });
    return posts.map(post => this.createEntity(post));
  }

  async findByLanguages(
    langs: Language[],
    currentUserId: ID = ""
  ): Promise<Post[]> {
    const conditions: any[] = [
      {
        OR: [
          {
            published: true
          },
          {
            published: false,
            user: {
              id: currentUserId
            }
          }
        ]
      }
    ];
    if (langs.length > 0) {
      conditions.push({
        language: {
          in: langs
        }
      });
    }
    const posts = await this.photon.posts.findMany({
      where: {
        AND: conditions
      },
      include: {
        user: true
      }
    });
    return posts.map(post => this.createEntity(post));
  }
}
