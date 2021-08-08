import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { GameState } from '../../../../../../shared/enums';
import { AnswerEntity } from '../../entities/AnswerEntity';
import { ChoiceEntity } from '../../entities/ChoiceEntity';
import { GameEntity } from '../../entities/GameEntity';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { QuestionEntity } from '../../entities/QuestionEntity';
import { TurnEntity } from '../../entities/TurnEntity';

export const createPlayerEntity = async () => {
  const player = new PlayerEntity();

  player.id = uuid();
  player.nick = 'nick';

  await getRepository(PlayerEntity).save(player);

  return player;
};

export const createGameEntity = async (players: PlayerEntity[]) => {
  const game = new GameEntity();

  game.id = uuid();
  game.code = 'code';
  game.state = GameState.idle;
  game.players = players;

  await getRepository(GameEntity).save(game);

  return game;
};

export const createChoiceEntity = async (game: GameEntity, position: number) => {
  const choice = new ChoiceEntity();

  choice.id = uuid();
  choice.text = 'choice at ' + position;
  choice.position = position;
  choice.game = game;

  await getRepository(ChoiceEntity).save(choice);

  return choice;
};

export const createQuestionEntity = async (game: GameEntity) => {
  const question = new QuestionEntity();

  question.id = uuid();
  question.text = 'question';
  question.game = game;
  question.blanks = [];

  await getRepository(QuestionEntity).save(question);

  return question;
};

export const createAnswerEntity = async (
  game: GameEntity,
  player: PlayerEntity,
  question: QuestionEntity,
  choices: ChoiceEntity[],
  position = 1,
) => {
  const answer = new AnswerEntity();

  answer.id = uuid();
  answer.choices = choices;
  answer.player = player;
  answer.question = question;
  answer.current_of_game = game;

  if (position) {
    answer.position = position;
  }

  await getRepository(AnswerEntity).save(answer);

  return answer;
};

export const createTurnEntity = async (
  game: GameEntity,
  questionMaster: PlayerEntity,
  winner: PlayerEntity,
  question: QuestionEntity,
  answers: AnswerEntity[],
) => {
  const turn = new TurnEntity();

  turn.id = uuid();
  turn.game = game;
  turn.questionMaster = questionMaster;
  turn.winner = winner;
  turn.question = question;
  turn.answers = answers;

  await getRepository(TurnEntity).save(turn);

  return turn;
};
