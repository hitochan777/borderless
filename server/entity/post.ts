import { Language } from "../value/language";
import { ID } from "../types";
import { Line } from "./line";

export class Post {
  constructor(
    public id: ID,
    public userId: ID,
    public language: Language,
    public content: { [key: string]: any },
    public isDraft: boolean
  ) {}

  get lines(): Line[] {
    return this.content.document.nodes.map(
      // TODO: id is temporarily sequential
      // TODO: handle marker
      (node: any, index: number) => new Line(index, node.nodes[0].text)
    );
  }

  get title(): string {
    const lines = this.lines;
    if (lines.length === 0) {
      return "";
    }
    return this.lines[0].text;
  }
}

/*
 * {
  "object": "value",
  "document": {
    "object": "document",
    "data": {},
    "nodes": [
      {
        "object": "block",
        "type": "line",
        "data": {},
        "nodes": [
          {
            "object": "text",
            "text": "first line",
            "marks": []
          }
        ]
      },
      {
        "object": "block",
        "type": "line",
        "data": {},
        "nodes": [
          {
            "object": "text",
            "text": "second line",
            "marks": []
          }
        ]
      }
    ]
  }
}
 */
