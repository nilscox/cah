import { Answer } from '../domain/entities/Answer';
import { Choice } from '../domain/entities/Choice';
import { GamePlayer, GameState, PlayState } from '../domain/entities/game';
import { array } from '../shared/array';
import { arrayToObject } from '../shared/arrayToObject';
import { first } from '../shared/first';
import { gameActions } from '../store/slices/game/game.actions';
import {
  selectAnswers,
  selectGame,
  selectPlayersExcludingQuestionMaster,
  selectQuestion,
  selectQuestionMaster,
  selectTurns,
  selectWinner,
} from '../store/slices/game/game.selectors';
import { playerActions } from '../store/slices/player/player.actions';
import { selectPlayer, selectPlayerCards } from '../store/slices/player/player.selectors';
import { AppThunk } from '../store/types';

import {
  createAnonymousAnswer,
  createChoice,
  createChoices,
  createGame,
  createGamePlayer,
  createGamePlayers,
  createPlayer,
  createQuestion,
} from './factories';
import { TestStore } from './TestStore';

type CreateGameOpts = {
  code?: string;
  creator?: string;
  players?: GamePlayer[];
};

type StartGameOpts = {
  initialQuestionMaster?: GamePlayer;
  turns?: number;
};

export class TestBuilder {
  private actions: AppThunk[] = [];

  constructor(private readonly store = new TestStore()) {
    beforeEach(() => {
      this.dispatchActions();
    });
  }

  apply(action: AppThunk) {
    this.actions.push(action);

    return this;
  }

  debug() {
    this.store.debug();

    return this;
  }

  private dispatchActions() {
    for (const action of this.actions) {
      this.store.dispatch(action);
    }
  }

  getStore(dispatchActions = false) {
    if (dispatchActions) {
      this.dispatchActions();
    }

    return this.store;
  }

  static setPlayer(player = createPlayer()): AppThunk {
    return (dispatch) => {
      dispatch(playerActions.setPlayer(player));
    };
  }

  static createGame({ code, creator, players }: CreateGameOpts = {}): AppThunk {
    return (dispatch, getState) => {
      const player = selectPlayer(getState());

      const game = createGame({
        code,
        creator,
        players: arrayToObject(players ?? [createGamePlayer(player), ...createGamePlayers(2)]),
      });

      dispatch(gameActions.setGame(game));
      dispatch(playerActions.initializePlayerGame(game.id));
    };
  }

  static startGame({ initialQuestionMaster, turns = 1 }: StartGameOpts = {}): AppThunk {
    return (dispatch, getState) => {
      const player = selectPlayer(getState());
      const questionMaster = initialQuestionMaster ?? player;

      dispatch(
        gameActions.updateGame({
          state: GameState.started,
          playState: PlayState.playersAnswer,
          questionMaster: questionMaster.id,
          totalQuestions: turns,
          answers: [],
        }),
      );

      dispatch(playerActions.addChoices(createChoices(11)));

      dispatch(TestBuilder.setQuestion());
    };
  }

  static setPlayerCards(newCards: Choice[]): AppThunk {
    return (dispatch, getState) => {
      const cards = selectPlayerCards(getState());

      dispatch(playerActions.removeChoices(cards));
      dispatch(playerActions.addChoices(newCards));
    };
  }

  static setQuestion(question = createQuestion()): AppThunk {
    return (dispatch) => {
      dispatch(gameActions.updateGame({ question }));
      dispatch(playerActions.resetSelection(question.numberOfBlanks));
    };
  }

  static answerQuestion(): AppThunk {
    return (dispatch, getState, { routerGateway }) => {
      const player = selectPlayer(getState());
      const players = selectPlayersExcludingQuestionMaster(getState());
      const questionMaster = selectQuestionMaster(getState());
      const question = selectQuestion(getState());

      const answers = players.map(() => {
        return createAnonymousAnswer({
          choices: array(question.numberOfBlanks, () => createChoice()),
        });
      });

      dispatch(
        gameActions.updateGame({
          playState: PlayState.questionMasterSelection,
          answers,
        }),
      );

      if (player.id !== questionMaster.id) {
        const cards = selectPlayerCards(getState());

        for (let i = 0; i < question.numberOfBlanks; ++i) {
          dispatch(playerActions.selectChoice(cards[i], i));
        }

        dispatch(playerActions.setSelectionValidated());
      }

      routerGateway.pushGame(selectGame(getState()), '/started/winner-selection');
    };
  }

  static selectWinner(winner?: GamePlayer): AppThunk {
    return (dispatch, getState, { routerGateway }) => {
      const players = selectPlayersExcludingQuestionMaster(getState());
      const answers = selectAnswers(getState());

      dispatch(
        gameActions.updateGame({
          playState: PlayState.endOfTurn,
          answers: answers.map((answer, index) => ({
            ...answer,
            player: players[index],
          })),
          winner: winner?.id ?? (first(players)?.id as string),
        }),
      );

      routerGateway.pushGame(selectGame(getState()), '/started/end-of-turn');
    };
  }

  static endCurrentTurn(): AppThunk {
    return (dispatch, getState) => {
      const turns = selectTurns(getState());

      dispatch(
        gameActions.addTurn({
          number: turns.length + 1,
          question: selectQuestion(getState()),
          answers: selectAnswers(getState()) as Answer[],
          winner: selectWinner(getState())?.id as string,
        }),
      );

      dispatch(
        gameActions.updateGame({
          answers: [],
          winner: undefined,
        }),
      );
    };
  }

  static playTurn(winner?: GamePlayer): AppThunk {
    return (dispatch) => {
      dispatch(this.answerQuestion());
      dispatch(this.selectWinner(winner));
      dispatch(this.endCurrentTurn());
    };
  }
}
