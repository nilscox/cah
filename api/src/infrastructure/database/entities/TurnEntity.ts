import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { Turn } from '../../../domain/models/Turn';

import { AnswerEntity } from './AnswerEntity';
import { GameEntity } from './GameEntity';
import { PlayerEntity } from './PlayerEntity';
import { QuestionEntity } from './QuestionEntity';

@Entity({ name: 'turn' })
export class TurnEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @ManyToOne(() => GameEntity, (game) => game.turns, { nullable: false })
  game?: GameEntity;

  @Column()
  gameId?: string;

  @ManyToOne(() => PlayerEntity, { nullable: false })
  questionMaster!: PlayerEntity;

  @OneToOne(() => QuestionEntity, { nullable: false })
  @JoinColumn()
  question!: QuestionEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.current_of_turn)
  answers!: AnswerEntity[];

  @ManyToOne(() => PlayerEntity, { nullable: false })
  winner?: PlayerEntity;

  static toPersistence(turn: Turn, gameId: string): TurnEntity {
    const entity = new TurnEntity();

    entity.id = turn.id;
    entity.questionMaster = PlayerEntity.toPersistence(turn.questionMaster);
    entity.question = QuestionEntity.toPersistence(turn.question, gameId);
    entity.answers = turn.answers.map((answer) => AnswerEntity.toPersistence(answer, gameId));
    entity.winner = PlayerEntity.toPersistence(turn.winner);
    entity.gameId = gameId;

    return entity;
  }
}
