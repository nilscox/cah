import { Connection, Repository } from 'typeorm';

import { GameRepository } from '../../../../domain/interfaces/GameRepository';
import { Choice } from '../../../../domain/models/Choice';
import { Game } from '../../../../domain/models/Game';
import { Question } from '../../../../domain/models/Question';
import { Turn } from '../../../../domain/models/Turn';
import { AnswerEntity } from '../../entities/AnswerEntity';
import { ChoiceEntity } from '../../entities/ChoiceEntity';
import { GameEntity } from '../../entities/GameEntity';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { QuestionEntity } from '../../entities/QuestionEntity';
import { TurnEntity } from '../../entities/TurnEntity';

export class SQLGameRepository implements GameRepository {
  private readonly repository: Repository<GameEntity>;
  private readonly questionRepository: Repository<QuestionEntity>;
  private readonly choiceRepository: Repository<ChoiceEntity>;
  private readonly answerRepository: Repository<AnswerEntity>;
  private readonly turnRepository: Repository<TurnEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(GameEntity);
    this.questionRepository = connection.getRepository(QuestionEntity);
    this.choiceRepository = connection.getRepository(ChoiceEntity);
    this.answerRepository = connection.getRepository(AnswerEntity);
    this.turnRepository = connection.getRepository(TurnEntity);
  }

  async findAll(): Promise<Game[]> {
    const entities = await this.repository.find({
      relations: [
        'players',
        'players.cards',
        'questionMaster',
        'question',
        'currentAnswers',
        'currentAnswers.player',
        'currentAnswers.question',
        'currentAnswers.choices',
        'winner',
      ],
    });

    return entities.map(GameEntity.toDomain);
  }

  async findGameById(id: string): Promise<Game | undefined> {
    const entity = await this.repository.findOne(id, {
      relations: [
        'players',
        'players.cards',
        'questionMaster',
        'question',
        'currentAnswers',
        'currentAnswers.player',
        'currentAnswers.question',
        'currentAnswers.choices',
        'winner',
      ],
    });

    if (entity) {
      return GameEntity.toDomain(entity);
    }
  }

  async findGameForPlayer(playerId: string): Promise<Game | undefined> {
    const game = await this.repository
      .createQueryBuilder('game')
      .leftJoin('game.players', 'player')
      .where('player.id = :playerId', { playerId })
      .getOne();

    if (game) {
      return this.findGameById(game.id);
    }
  }

  async addQuestions(gameId: string, questions: Question[]): Promise<void> {
    await this.questionRepository.insert(questions.map((question) => QuestionEntity.toPersistence(question, gameId)));
  }

  async findNextAvailableQuestion(gameId: string): Promise<Question | undefined> {
    // const entity = await this.questionRepository
    //   .createQueryBuilder('question')
    //   .leftJoin('question.game', 'game')
    //   .leftJoin('game.turns', 'turns')
    //   .where('game.id = :gameId', { gameId })
    //   .andWhere('game.question_id IS NOT question.id')
    //   .andWhere('turns.question_id IS NOT question.id')
    //   .getOne();

    const game = await this.repository.findOneOrFail(gameId, { relations: ['question'] });
    const qb = this.questionRepository.createQueryBuilder('question').where('question.gameId = :id', { id: gameId });

    if (game.question) {
      qb.andWhere('question.id <> :questionId', { questionId: game.question?.id });
    }

    qb.andWhere(
      (qb) =>
        'question.id NOT IN ' +
        qb
          .subQuery()
          .select('question.id')
          .from(TurnEntity, 'turn')
          .leftJoin('turn.question', 'question')
          .where('turn.gameId = :gameId', { gameId: game.id })
          .getQuery(),
    );

    const entity = await qb.getOne();

    if (entity) {
      return QuestionEntity.toDomain(entity);
    }
  }

  async addChoices(gameId: string, choices: Choice[]): Promise<void> {
    await this.choiceRepository.insert(choices.map((choice) => ChoiceEntity.toPersistence(choice, gameId)));
  }

  async findAvailableChoices(gameId: string): Promise<Choice[]> {
    // const entities = await this.choiceRepository
    //   .createQueryBuilder('choice')
    //   .leftJoin('choice.game', 'game')
    //   .leftJoin('game.players', 'players')
    //   .leftJoin('players.cards', 'cards')
    //   .leftJoin('game.currentAnswers', 'currentAnswers')
    //   .leftJoin('currentAnswers.choices', 'currentAnswersChoices')
    //   .leftJoin('game.turns', 'turns')
    //   .leftJoin('turns.answers', 'turnsAnswers')
    //   .leftJoin('turnsAnswers.choices', 'turnsAnswersChoices')
    //   .where('game.id = :gameId', { gameId })
    //   .andWhere('cards.id <> choice.id')
    //   .andWhere('currentAnswersChoices.id <> choice.id')
    //   .andWhere('turnsAnswersChoices.id <> choice.id')
    //   .getMany();

    const game = await this.repository.findOneOrFail(gameId, { relations: ['question'] });
    const entities = await this.choiceRepository
      .createQueryBuilder('choice')
      .where('choice.gameId = :gameId', { gameId: game.id })
      .andWhere(
        (qb) =>
          'choice.id NOT IN ' +
          qb
            .subQuery()
            .select('card.id')
            .from(PlayerEntity, 'player')
            .innerJoin('player.cards', 'card')
            .where('player.gameId = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .andWhere(
        (qb) =>
          'choice.id NOT IN ' +
          qb
            .subQuery()
            .select('choice.id')
            .from(AnswerEntity, 'answer')
            .innerJoin('answer.choices', 'choice')
            .where('answer.current_of_game = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .andWhere(
        (qb) =>
          'choice.id NOT IN ' +
          qb
            .subQuery()
            .select('choice.id')
            .from(TurnEntity, 'turn')
            .innerJoin('turn.answers', 'answer')
            .innerJoin('answer.choices', 'choice')
            .where('turn.gameId = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .getMany();

    return entities.map(ChoiceEntity.toDomain);
  }

  async addTurn(gameId: string, turn: Turn): Promise<void> {
    await this.turnRepository.save(TurnEntity.toPersistence(turn, gameId));
  }

  async save(game: Game): Promise<void> {
    const entity = GameEntity.toPersistence(game);

    if (entity.question) {
      await this.questionRepository.save(entity.question);
    }

    if (entity.currentAnswers) {
      await this.answerRepository.save(entity.currentAnswers);
    }

    await this.repository.save(entity);
  }
}
