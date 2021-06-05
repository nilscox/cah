import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ChoiceEntity } from './ChoiceEntity';
import { GameEntity } from './GameEntity';
import { PlayerEntity } from './PlayerEntity';
import { TurnEntity } from './TurnEntity';

@Entity({ name: 'answer' })
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => GameEntity, (game) => game.answers)
  game?: GameEntity;

  @ManyToOne(() => PlayerEntity, { nullable: false })
  player!: PlayerEntity;

  @OneToMany(() => ChoiceEntity, (choice) => choice.answer)
  choices!: ChoiceEntity[];

  @ManyToOne(() => TurnEntity)
  turn?: TurnEntity;
}
