import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";

import { Language } from "../value/language";
import { User } from "./user";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(() => User, {eager: true})
  user: User = new User({});

  @Column({
    transformer: {
      from: (language: string): Language => +language,
      to: (language: Language): string => `${language}`
    }
  })
  language: Language = Language.English;

  @Column() text: string = "";

  constructor(post: Partial<Post>) {
    Object.assign(this, post);
  }
}
