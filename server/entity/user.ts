import { Language } from "../value/language";
import { ID } from "../types";
export class User {
  constructor(
    public id: ID,
    public uid: string,
    public email: string,
    public username: string,
    public fluentLanguages: Language[],
    public learningLanguages: Language[]
  ) {}
}
