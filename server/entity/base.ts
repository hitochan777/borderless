import { ID, NullableID } from "../types";

const DEFAULT_ID = -1;

export class Base {
  public id: ID;
  constructor(_id: NullableID) {
    this.id = _id ?? DEFAULT_ID;
  }

  notPersisted() {
    return this.id === DEFAULT_ID;
  }
}
