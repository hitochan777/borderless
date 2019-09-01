import * as Knex from "knex";

import { buildRepositoryContainer } from "../..";
import { Language } from "../../value/language";

export async function seed(knex: Knex): Promise<any> {
  const { userRepository, postRepository } = buildRepositoryContainer(knex);

  const entities = [
    {
      user: {
        uid: "user1",
        email: "user1@borderless.com",
        username: "user1",
        learningLanguages: [Language.English, Language.Japanese],
        fluentLanguages: [Language.Korean, Language.Chinese]
      },
      posts: [
        {
          language: Language.English,
          text: "this is a text in English from user1"
        },
        {
          language: Language.English,
          text: "this is another text in English from user1"
        },
        {
          language: Language.Japanese,
          text: "これはuser1が投稿した日本語の文です。"
        }
      ]
    },
    {
      user: {
        uid: "user2",
        email: "user2@borderless.com",
        username: "user2",
        learningLanguages: [Language.English],
        fluentLanguages: [Language.Korean]
      },
      posts: [
        {
          language: Language.English,
          text: "this is a text in Japanese from user2"
        },
        {
          language: Language.Japanese,
          text: "this is a text in Japanese from user2"
        }
      ]
    }
  ];

  for (let entity of entities) {
    const user = await userRepository.create(entity.user);
    if (!user) {
      throw new Error("Failed to create an user");
    }
    for (let post of entity.posts) {
      const createdPost = await postRepository.create({
        userId: user.id,
        ...post
      });
      if (!createdPost) {
        throw new Error("Failed to create a post");
      }
    }
  }
}
