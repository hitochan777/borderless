import { Value } from "slate";
import { LineFieldFragment, LineInput } from "../generated/types";

export function transformToGql(value: Value): LineInput[] {
  const state: any = value.document.toJS();
  return state.nodes.map((lineNode: any) => ({
    id: +lineNode.data.id,
    partialLines: lineNode.nodes.map((sublineNode: any) => ({
      subtext: sublineNode.text
    }))
  }));
}
export function transformfromGql(lines: LineFieldFragment[]): Value {
  return Value.fromJSON({
    document: {
      nodes: lines.map(line => ({
        object: "block",
        type: "line",
        nodes: line.partialLines.map(partial => ({
          object: "text",
          text: partial.text,
          marks: []
        })),
        data: {
          id: line.id
        }
      }))
    }
  });
}
