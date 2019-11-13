import knex from "knex";

import { Line } from "../entity/line";
import { ID } from "../types";
import { Language } from "../value/language";

interface RawPost {
  id: number;
  userId: number;
  language: number;
  content: string;
  isDraft: boolean;
}

interface PostInput {
  userId: ID;
  language: number;
  content: string;
  isDraft: boolean;
}

interface RawRepliable {
  id: ID;
}
