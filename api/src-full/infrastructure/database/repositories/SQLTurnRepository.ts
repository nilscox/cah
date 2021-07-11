import { EntityRepository, Repository } from 'typeorm';

import { TurnRepository } from '../../../domain/interfaces/TurnRepository';
import { AnswerEntity } from '../entities/AnswerEntity';
import { GameEntity } from '../entities/GameEntity';
import { PlayerEntity } from '../entities/PlayerEntity';
import { QuestionEntity } from '../entities/QuestionEntity';
import { TurnEntity } from '../entities/TurnEntity';

@EntityRepository(TurnEntity)
export class SQLTurnRepository extends Repository<TurnEntity> implements TurnRepository {
  async createTurn(
    game: GameEntity,
    questionMaster: PlayerEntity,
    question: QuestionEntity,
    answers: AnswerEntity[],
    winner: PlayerEntity,
  ): Promise<TurnEntity> {
    const turn = new TurnEntity();

    turn.game = game;
    turn.questionMaster = questionMaster;
    turn.question = question;
    turn.answers = answers;
    turn.winner = winner;

    await this.save(turn);

    return turn;
  }
}
