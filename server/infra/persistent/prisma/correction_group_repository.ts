import {
  PrismaClient,
  User as UserModel,
  Post as PostModel,
  Tweet as TweetModel,
  CorrectionGroup as CorrectionGroupModel,
} from "@prisma/client";

import { CorrectionGroup } from "../../../entity/correction_group";
import { ID } from "../../../types";

export class CorrectionGroupRepository {
  private photon: PrismaClient;
  constructor(driver: PrismaClient) {
    this.photon = driver;
  }

  async create(correctionGroup: CorrectionGroup): Promise<CorrectionGroup> {
    console.log(correctionGroup);
    const createdCorrectionGroup = await this.photon.correctionGroup.create({
      data: {
        user: {
          connect: {
            id: correctionGroup.userId,
          },
        },
        post: {
          connect: {
            id: correctionGroup.postId,
          },
        },
        summaryComment: {
          connect: {
            id: correctionGroup.summaryCommentId,
          },
        },
        corrections: {
          connect: correctionGroup.correctionIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        corrections: true,
        summaryComment: true,
        user: true,
        post: true,
      },
    });

    return this.createEntity(createdCorrectionGroup);
  }

  async findManyByPostId(postId: ID): Promise<CorrectionGroup[]> {
    return []; // TODO
  }

  createEntity(
    correctionGroup: CorrectionGroupModel & {
      user: UserModel;
      post: PostModel;
      corrections: TweetModel[];
      summaryComment: TweetModel | null;
    }
  ): CorrectionGroup {
    return new CorrectionGroup(
      correctionGroup.id,
      correctionGroup.post.id,
      correctionGroup.user.id,
      correctionGroup.summaryComment?.id ?? null,
      correctionGroup.corrections.map((correction) => correction.id),
      correctionGroup.createdAt,
      correctionGroup.updatedAt
    );
  }
}
