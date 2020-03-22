import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements("Node");
    t.string("username");
    t.string("email");
    t.timezone("timezone");
    t.list.field("fluentLanguages", {
      type: "Language",
      resolve(root) {
        return root.fluentLanguages.map((lang) => ({
          id: lang.code,
          name: lang.name,
        }));
      },
    });
    t.list.field("learningLanguages", {
      type: "Language",
      resolve(root) {
        return root.learningLanguages.map((lang) => ({
          id: lang.code,
          name: lang.name,
        }));
      },
    });
    t.list.field("posts", {
      type: "Post",
      async resolve(
        root,
        _,
        { repositories: { userRepository, postRepository } }
      ) {
        const user = await userRepository.findById(root.id);
        if (!user) {
          throw new Error("user is empty");
        }
        const posts = await postRepository.findByUser(user.id);
        return posts;
      },
    });
    t.date("createdAt", {
      nullable: true,
      resolve(root) {
        return root.createdAt;
      },
    });
    t.date("updatedAt", {
      nullable: true,
      resolve(root) {
        return root.updatedAt;
      },
    });
  },
});
