import { expect } from 'chai';

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

    expect(turns).to.have.length(2);

    expect(turns[0]).to.eql({
      number: 1,
      questionMaster: questionMaster.nick,
      question: question.toJSON(),
      answers: [answers[0].toJSON()],
      winner: winner.nick,
    });

    expect(turns[1]).to.shallowDeepEqual({
      number: 2,
    });
  });
});
