import { Language } from "../value/language";
import { ID } from "../types";
import { Base } from "./base";

export class User extends Base {
  constructor(
    _id: ID,
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
