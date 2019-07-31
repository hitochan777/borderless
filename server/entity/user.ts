import { Language } from "../value/language";
export class User {
  constructor(
    public id: ID,
    public email: string,
    public username: string,
    public fluentLanguages: Language[],
    public learningLanguages: Language[]
  ) {}
}
