import { Language } from "../value/language";

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

const languageTransformer = {
  from: (languages: string): Language[] =>
    languages.trim().length === 0
      ? []
      : languages.split(",").map(lang_id => +lang_id),
  to: (languages: Language[]): string => languages.join(",")
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;
  @Column()
  uid: string = "";
  @Column()
  email: string = "";
  @Column()
  username: string = "";
  @Column({
    type: "varchar",
    transformer: languageTransformer
  })
  fluentLanguages: Language[] = [];
  @Column({
    type: "varchar",
    transformer: languageTransformer
  })
  learningLanguages: Language[] = [];
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}