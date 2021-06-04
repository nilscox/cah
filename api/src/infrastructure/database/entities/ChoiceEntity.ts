import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AnswerEntity } from './AnswerEntity';
import { GameEntity } from './GameEntity';
import { PlayerEntity } from './PlayerEntity';

@Entity({ name: 'choice' })
export class ChoiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @ManyToOne(() => GameEntity, { nullable: false })
  game?: GameEntity;

  @ManyToOne(() => PlayerEntity, (player) => player.cards)
  player?: PlayerEntity;

  @ManyToOne(() => AnswerEntity, (answer) => answer.choices)
  answer?: AnswerEntity;

  is(other?: ChoiceEntity) {
    return this.id === other?.id;
  }
}
