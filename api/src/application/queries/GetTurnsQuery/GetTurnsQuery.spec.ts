import { expect } from 'earljs';

import { Answer } from '../../../domain/models/Answer';
import { createChoice } from '../../../domain/models/Choice';
import { Player } from '../../../domain/models/Player';
import { createQuestion } from '../../../domain/models/Question';
import { Turn } from '../../../domain/models/Turn';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { StubSessionStore } from '../../../infrastructure/stubs/StubSessionStore';
import { PlayState } from '../../../shared/enums';
import { array } from '../../../utils/array';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { GetTurnsHandler } from './GetTurnsQuery';

describe('GetTurnsQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let builder: GameBuilder;

  let handler: GetTurnsHandler;

  const session = new StubSessionStore();

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, builder } = deps);

    handler = instanciateHandler(GetTurnsHandler, deps);
  });

  it("fetches a game's turns", async () => {
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();

    const question = createQuestion();
    const questionMaster = new Player('question master');
    const winner = new Player('winner');
    const answers = [new Answer(winner, question, [createChoice()])];

    const gameTurns = array(2, () => new Turn(questionMaster, question, answers, winner));

    await gameRepository.addTurn(game.id, gameTurns[0]);
    await gameRepository.addTurn(game.id, gameTurns[1]);

    const turns = await handler.execute({ gameId: game.id }, session);

    expect(turns).toBeAnArrayOfLength(2);
    expect(turns[0]).toEqual({
      id: turns[0].id,
      number: 1,
      questionMaster: questionMaster.id,
      question: question.toJSON(),
      answers: [
        {
          id: answers[0].id,
          choices: [expect.objectWith({ id: answers[0].choices[0].id })],
          player: winner.id,
          formatted: expect.a(String),
        },
      ],
      winner: winner.id,
    });

    expect(turns[1]).toBeAnObjectWith({
      number: 2,
    });
  });
});
