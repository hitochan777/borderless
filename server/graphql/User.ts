import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements("Node");
    t.string("username");
    t.string("email");
    t.list.field("fluentLanguages", {
      type: "Int"
    });
    t.list.field("learningLanguages", {
      type: "Int"
    });
    t.list.field("posts", {
      type: "Post",
      async resolve(
        root,
        _,
        { repositories: { userRepository, postRepository } }
      ) {
        // postRepository.findByUser only accept user.id not uid
        const user = await userRepository.findByUid(root.uid);
        if (!user) {
          throw new Error("user is empty");
        }
        const posts = await postRepository.findByUser(user.id);
        return posts;
      }
    });
  }
});
