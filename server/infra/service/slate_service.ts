import { Line } from "../../entity/line";

export class SlateService {
  transformLinesToSlateJson(lines: Line[]): object {
    const json: { [key: string]: any } = {
      object: "value",
      document: {
        object: "document",
        data: {}
      }
    };
    const nodes = lines.map(line => {
      const nodes = line.lineContent.partialLines.map(partialLine => {
        return {
          object: "text",
          text: partialLine.subtext,
          marks: partialLine.referers
        };
      });
      return {
        object: "block",
        type: "line",
        data: {},
        nodes
      };
    });
    json.document.nodes = nodes;
    return json;
  }
}
