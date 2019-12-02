import knex from "knex";

import { ID } from "../types";

interface RawLineMarker {
  id: number;
  postId: number;
}

interface RawRepliable {
  id: number;
}

export class LineMarkerRepository {
  lineMarkers: () => knex.QueryBuilder<RawLineMarker, RawLineMarker[]>;
  repliables: () => knex.QueryBuilder<RawRepliable, RawRepliable[]>;
  constructor(db: knex) {
    this.lineMarkers = () => db("line_marker");
    this.repliables = () => db("repliable");
  }
  async generateIds(num: number, postId: number): Promise<ID[]> {
    const repliableIds = [];
    for (let i = 0; i < num; i++) {
      const _repliableIds = await this.repliables().insert({});
      if (_repliableIds.length !== 1) {
        throw new Error("repliable ids does not have one element");
      }
      repliableIds.push(_repliableIds[0]);
    }
    if (repliableIds.length !== num) {
      throw new Error(`Could not generate ${num} repliables`);
    }
    const lineMarkers = repliableIds.map(id => {
      return {
        id,
        postId
      };
    });
    const lineMarkerIds = [];
    for (let i = 0; i < num; i++) {
      const _lineMarkerIds = await this.lineMarkers().insert(lineMarkers[i]);
      if (_lineMarkerIds.length !== 1) {
        throw new Error("lineMarkerIds does not have one element");
      }

      lineMarkerIds.push(_lineMarkerIds[0]);
    }
    if (lineMarkerIds.length !== num) {
      throw new Error(
        `Could not generate ${num} line markers. generated ${lineMarkerIds.length} line markers`
      );
    }
    return lineMarkerIds;
  }
}
