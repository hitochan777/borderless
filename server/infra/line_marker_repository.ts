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
    this.lineMarkers = () => db("line_markers");
    this.repliables = () => db("repliable");
  }
  async generateIds(num: number, postId: number): Promise<ID[]> {
    const repliableRows = [];
    for (let i = 0; i < num; i++) {
      repliableRows.push({});
    }
    const repliableIds = await this.repliables().insert(repliableRows);
    if (repliableIds.length !== num) {
      throw new Error(`Could not generate ${num} repliables`);
    }
    const lineMarkers = repliableIds.map(id => {
      return {
        id,
        postId
      };
    });
    const lineMarkerIds = await this.lineMarkers().insert(lineMarkers);
    if (repliableIds.length !== num) {
      throw new Error(`Could not generate ${num} repliables`);
    }
    return lineMarkerIds;
  }
}
