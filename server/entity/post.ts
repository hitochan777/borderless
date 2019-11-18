import { Language } from "../value/language";
import { ID } from "../types";
import { Line } from "./line";

export class Post {
  constructor(
    public id: ID | null,
    public userId: ID,
    public language: Language,
    public lines: Line[],
    public isDraft: boolean
  ) {}

  static create({
    userId,
    language,
    lines,
    isDraft
  }: {
    userId: ID;
    language: Language;
    lines: Line[];
    isDraft: boolean;
  }): Post {
    return new Post(null, userId, language, lines, isDraft);
  }

  get title(): string {
    const lines = this.lines;
    if (lines.length === 0) {
      return "";
    }
    return this.lines[0].lineContent.partialLines
      .map(partialLine => partialLine.subtext)
      .join("");
  }
}

// Example of `lines`
[
  {
    text: [
      {
        subtext: "this i",
        referers: []
      },
      {
        subtext: "s a first",
        referers: []
      },
      {
        subtext: "line",
        referers: []
      }
    ],
    referers: []
  },
  {
    text: [
      {
        subtext: "this is a seco",
        referers: []
      },
      {
        subtext: "nd line",
        referers: []
      }
    ],
    referers: []
  }
];
