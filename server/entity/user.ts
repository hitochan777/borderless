import { Language } from "../value/language";
import { NullableID } from "../types";
import { Base } from "./base";

export class User extends Base {
  constructor(
    _id: NullableID,
    public uid: string,
    public email: string,
    public username: string,
    public fluentLanguages: Language[],
    public learningLanguages: Language[],
    public createdAt: Date | null = null,
    public updatedAt: Date | null = null
  ) {
    super(_id);
  }
}
