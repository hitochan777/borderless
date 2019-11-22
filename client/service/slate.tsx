import { Value } from "slate";
import { LineFieldFragment, LineInput } from "../generated/types";

export function transformToGql(value: Value): LineInput[] {
  const state: any = value.document.toJS();
  console.log(state.nodes[0]);
  return state.nodes.map((lineNode: any) => ({
    partialLines: lineNode.nodes.map((sublineNode: any) => ({
      subtext: sublineNode.text
    }))
  }));
}
export function transformfromGql(lines: LineFieldFragment[]): Value {
  return Value.fromJSON({
    document: {
      nodes: lines.map(line => ({
        type: "block",
        nodes: line.partialLines.map(partial => ({
          type: "line",
          text: partial.text,
          marks: []
        }))
      }))
    }
  });
}
