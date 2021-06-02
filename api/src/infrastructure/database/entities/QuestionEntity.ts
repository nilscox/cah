import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { GameEntity } from './GameEntity';
import { TurnEntity } from './TurnEntity';

@Entity({ name: 'question' })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column({ type: 'simple-array', nullable: true })
  blanks?: number[];

  @ManyToOne(() => GameEntity, { nullable: false })
  game?: GameEntity;

  @OneToOne(() => TurnEntity, (turn) => turn.question)
  turn?: TurnEntity;

  get neededChoices() {
    return this.blanks?.length ?? 1;
  }
}
