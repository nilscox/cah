import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { GameState, PlayState } from '../../../../../shared/enums';
import { Game } from '../../../domain/models/Game';

import { AnswerEntity } from './AnswerEntity';
import { PlayerEntity } from './PlayerEntity';
import { QuestionEntity } from './QuestionEntity';
import { TurnEntity } from './TurnEntity';

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'simple-enum', enum: GameState })
  state!: GameState;

  @Column({ type: 'simple-enum', enum: PlayState, nullable: true })
  playState?: PlayState;

  @OneToMany(() => PlayerEntity, (player) => player.game)
  players!: PlayerEntity[];

  @OneToOne(() => PlayerEntity)
  @JoinColumn()
  questionMaster?: PlayerEntity;

  @OneToOne(() => QuestionEntity)
  @JoinColumn()
  question?: QuestionEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.current_of_game, { nullable: true })
  currentAnswers!: AnswerEntity[];

  @OneToOne(() => PlayerEntity)
  @JoinColumn()
  winner?: PlayerEntity;

  @OneToMany(() => TurnEntity, (turn) => turn.game)
  turns!: TurnEntity[];

  static toPersistence(game: Game): GameEntity {
    const entity = new GameEntity();

    entity.id = game.id;
    entity.code = game.code;
    entity.players = game.players.map(PlayerEntity.toPersistence);
    entity.state = game.state;
    entity.playState = game.playState;

    if (game.isStarted()) {
      entity.questionMaster = PlayerEntity.toPersistence(game.questionMaster);
      entity.question = QuestionEntity.toPersistence(game.question, game.id);
      entity.currentAnswers = game.answers.map((answer) => AnswerEntity.toPersistence(answer, game.id));

      if (game.winner) {
        entity.winner = PlayerEntity.toPersistence(game.winner);
      }
    }

    return entity;
  }

  static toDomain(entity: GameEntity): Game {
    const game = new Game(entity.id, entity.code);

    game.players = entity.players.map(PlayerEntity.toDomain);
    game.state = entity.state;
    game.playState = entity.playState;

    if (game.isStarted()) {
      game.questionMaster = PlayerEntity.toDomain(entity.questionMaster!);
      game.question = QuestionEntity.toDomain(entity.question!);
      game.answers = entity.currentAnswers.map(AnswerEntity.toDomain);

      if (entity.winner) {
        game.winner = PlayerEntity.toDomain(entity.winner);
      }
    }

    game.dropEvents();

    return game;
  }
}
