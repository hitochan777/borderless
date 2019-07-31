import { Language } from "../value/language";
import { ID } from "../types"

export class Post {
  constructor(
    public id: ID,
    public userId: ID,
    public lineIds: ID[],
    public language: Language,
  ) {}
}
