import { LineFieldFragment, LineInput } from "../generated/types";
import { Node } from "slate";

export function transformToGql(nodes: Node[]): LineInput[] {
  return nodes.map((lineNode: any) => ({
    id: lineNode.id,
    partialLines: lineNode.children.map((sublineNode: any) => ({
      subtext: sublineNode.text,
    })),
  }));
}
export function transformfromGql(lines: LineFieldFragment[]): Node[] {
  return lines.map((line) => ({
    id: line.id,
    type: "line",
    children: line.partialLines.map((partial) => ({
      text: partial.text,
      marks: [],
    })),
  }));
}
