import { Language } from "../value/language";
export class User {
  constructor(
    public uid: string,
    public email: string,
    public username: string,
    public fluentLanguages: Language[],
    public learningLanguages: Language[]
  ) {}
}
