import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AnswerEntity } from './AnswerEntity';
import { GameEntity } from './GameEntity';
import { PlayerEntity } from './PlayerEntity';
import { QuestionEntity } from './QuestionEntity';

@Entity({ name: 'turn' })
export class TurnEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => GameEntity, (game) => game.turns, { nullable: false })
  game?: GameEntity;

  @ManyToOne(() => PlayerEntity, { nullable: false, eager: true })
  @JoinColumn()
  questionMaster!: PlayerEntity;

  @OneToOne(() => QuestionEntity, { nullable: false, eager: true })
  @JoinColumn()
  question!: QuestionEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.turn, { eager: true })
  answers!: AnswerEntity[];

  @ManyToOne(() => PlayerEntity, { nullable: false, eager: true })
  @JoinColumn()
  winner?: PlayerEntity;
}
