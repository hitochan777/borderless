import {
  PrismaClient,
  User as UserModel,
  Post as PostModel,
  Tweet as TweetModel,
  CorrectionGroup as CorrectionGroupModel,
} from "@prisma/client";

import { CorrectionGroup } from "../../../entity/correction_group";
import { ID } from "../../../types";
import { CorrectionGroupRepository } from "../../../domain/repository";

export class PrismaCorrectionGroupRepository
  implements CorrectionGroupRepository {
  private photon: PrismaClient;
  constructor(driver: PrismaClient) {
    this.photon = driver;
  }

  async create(correctionGroup: CorrectionGroup): Promise<CorrectionGroup> {
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
    const correctionGroups = await this.photon.correctionGroup.findMany({
      where: {
        post: {
          id: postId,
        },
      },
      include: {
        corrections: true,
        summaryComment: true,
        user: true,
        post: true,
      },
    });
    return correctionGroups.map((group) => this.createEntity(group));
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
