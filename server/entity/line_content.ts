import { ID } from "../types";
import { PartialLine } from "./partial_line";

export interface LineContent {
  id: ID | null;
  partialLines: PartialLine[];
}
