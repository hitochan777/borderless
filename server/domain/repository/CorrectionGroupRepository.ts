import { CorrectionGroup } from "../../entity/correction_group";
import { ID } from "../../types";

export interface CorrectionGroupRepository {
  create(correctionGroup: CorrectionGroup): Promise<CorrectionGroup>;
  findManyByPostId(postId: ID): Promise<CorrectionGroup[]>;
}
