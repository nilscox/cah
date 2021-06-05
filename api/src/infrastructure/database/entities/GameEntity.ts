import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AnswerEntity } from './AnswerEntity';
import { ChoiceEntity } from './ChoiceEntity';
import { PlayerEntity } from './PlayerEntity';
import { QuestionEntity } from './QuestionEntity';
import { TurnEntity } from './TurnEntity';

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
  paused = 'paused',
}

export enum PlayState {
  playersAnswer = 'playersAnswer',
  questionMasterSelection = 'questionMasterSelection',
  endOfTurn = 'endOfTurn',
}

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'simple-enum', enum: GameState, default: GameState.idle })
  state!: GameState;

  @Column({ unique: true })
  code!: string;

  @OneToMany(() => PlayerEntity, (player) => player.game, { eager: true })
  players!: PlayerEntity[];

  get playersExcludingQM() {
    return this.players.filter((player) => !player.is(this.questionMaster));
  }

  @OneToMany(() => QuestionEntity, (question) => question.game)
  questions?: QuestionEntity[];

  @OneToMany(() => ChoiceEntity, (choice) => choice.game)
  choices?: ChoiceEntity[];

  @OneToMany(() => TurnEntity, (turn) => turn.game)
  turns?: TurnEntity[];

  @Column({ type: 'simple-enum', enum: PlayState, nullable: true })
  playState?: PlayState;

  @OneToOne(() => PlayerEntity, { eager: true })
  @JoinColumn()
  questionMaster?: PlayerEntity;

  @OneToOne(() => QuestionEntity, { eager: true })
  @JoinColumn()
  question?: QuestionEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.game)
  answers?: AnswerEntity[];

  @OneToOne(() => PlayerEntity, { eager: true })
  @JoinColumn()
  winner?: PlayerEntity;
}
