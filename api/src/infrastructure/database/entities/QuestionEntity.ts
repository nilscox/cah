import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Blank } from '../../../domain/models/Blank';
import { Question } from '../../../domain/models/Question';

import { GameEntity } from './GameEntity';

@Entity({ name: 'question' })
export class QuestionEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column()
  text!: string;

  @Column({ type: 'simple-array' })
  blanks!: string[];

  @ManyToOne(() => GameEntity, { nullable: false })
  game!: GameEntity;

  @Column()
  gameId!: string;

  static toPersistence(question: Question, gameId: string): QuestionEntity {
    const entity = new QuestionEntity();

    entity.id = question.id;
    entity.text = question.text;
    entity.blanks = (question.blanks ?? []).map(String);
    entity.gameId = gameId;

    return entity;
  }

  static toDomain(entity: QuestionEntity): Question {
    const blanks = entity.blanks.length ? entity.blanks.map((value) => new Blank(Number(value))) : undefined;

    const question = new Question(entity.text, blanks);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    question.id = entity.id;

    return question;
  }
}
