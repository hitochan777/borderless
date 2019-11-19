import { ID } from "../types";
import { PartialLine } from "./partial_line";

export interface LineContent {
  id: ID;
  partialLines: PartialLine[];
}
