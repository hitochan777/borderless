import { ID } from "../../types";

export interface LineMarkerRepository {
  generateIds(num: number, postId: ID): Promise<ID[]>;
}
