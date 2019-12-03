import { ID, NullableID } from "../types";

const DEFAULT_ID = "DEFAULT_ID";

export class Base {
  public id: ID;
  constructor(_id: NullableID) {
    this.id = _id ?? DEFAULT_ID;
  }

  isNotPersisted() {
    return this.id === DEFAULT_ID;
  }
}
