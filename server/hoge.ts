import { PrismaClient } from "@prisma/client";

const driver = new PrismaClient({
  log: ["query", "info"],
});

async function main() {
  const createdTweet = await driver.tweet.create({
    data: {
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
          id: tweet.inReplyTo ?? undefined,
        },
      },
      content: tweet.text,
      correction: tweet.correction,
      repliable: { create: {} },
    },
    include: {
      user: true,
      post: true,
      inReplyTo: true,
    },
  });
}

main();
