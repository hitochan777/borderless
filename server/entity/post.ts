import { Language } from "../value/language";
import { ID } from "../types";

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
      (node: any) => new Line(0, node.nodes[0].text) // TODO: id is temporarily 0
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
