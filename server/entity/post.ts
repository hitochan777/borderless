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

  get lines(): string[] {
    return this.content.document.nodes.map((node: any) => node.nodes[0].text);
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
