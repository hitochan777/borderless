import { Base } from "./base";
import { ID, NullableID } from "../types";
import { Tweet } from "./tweet";

export class CorrectionGroup extends Base {
  constructor(
    _id: NullableID,
    public postId: ID,
    public userId: ID,
    public summaryCommentId: NullableID,
    public correctionIds: ID[],
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {
    super(_id);
  }

  static fromTweets(
    corrections: Tweet[],
    summaryComment: Tweet | null
  ): CorrectionGroup {
    if (!summaryComment && corrections.length === 0) {
      throw new Error(
        "You need to provide at least one correction or summary comment"
      );
    }
    const userIds = corrections.map((correction) => correction.userId);
    if (new Set(userIds).size > 1) {
      throw new Error("Found more than one unique user ids");
    }
    const postIds = corrections.map((correction) => correction.postId);
    if (new Set(postIds).size > 1) {
      throw new Error("Found more than one unique post ids");
    }
    const userId = userIds[0] || summaryComment?.userId;
    if (!userId) {
      throw new Error("User ID is not defined");
    }
    const postId = postIds[0] || summaryComment?.postId;
    if (!postId) {
      throw new Error("Post ID is not defined");
    }
    if (corrections.length > 0) {
      if (summaryComment && userId !== summaryComment.userId) {
        throw new Error(
          "Owner of summary comment is different from that of corrections"
        );
      }
      if (summaryComment && postId !== summaryComment.postId) {
        throw new Error(
          "PostId of summary comment is different from that of corrections"
        );
      }
    }

    const correctionIds = corrections.map((correction) => correction.id);
    return new CorrectionGroup(
      null,
      postId,
      userId,
      summaryComment?.id ?? null,
      correctionIds,
      null,
      null
    );
  }
}
