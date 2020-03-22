import { Language } from "../value/language";
import { ID, NullableID } from "../types";
import { Line } from "./line";
import { Base } from "./base";

interface PostFactoryInput {
  userId: ID;
  language: Language;
  lines: Line[];
  isDraft: boolean;
}

export class Post extends Base {
  constructor(
    _id: NullableID,
    public userId: ID,
    public language: Language,
    public lines: Line[],
    public isDraft: boolean,
    public createdAt: Date | null = null,
    public updatedAt: Date | null = null
  ) {
    super(_id);
  }

  static create({ userId, language, lines, isDraft }: PostFactoryInput): Post {
    return new Post(null, userId, language, lines, isDraft, null, null);
  }

  get title(): string {
    const lines = this.lines;
    if (lines.length === 0) {
      return "";
    }
    return this.lines[0].lineContent.partialLines
      .map((partialLine) => partialLine.subtext)
      .join("");
  }
}
