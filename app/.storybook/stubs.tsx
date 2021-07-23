import { action } from '@storybook/addon-actions';

import { Answer } from '../src/domain/entities/Answer';
import { Choice } from '../src/domain/entities/Choice';
import { Game } from '../src/domain/entities/Game';
import { Player } from '../src/domain/entities/Player';
import { GameGateway } from '../src/domain/gateways/GameGateway';
import { PlayerGateway } from '../src/domain/gateways/PlayerGateway';
import { RTCGateway, RTCListener } from '../src/domain/gateways/RTCGateway';
import { createGame, createPlayer } from '../src/tests/factories';

export class StubGameGateway implements GameGateway {
  fetchGame(_gameId: string): Promise<Game> {
    throw new Error('Method not implemented.');
  }

  async createGame(): Promise<Game> {
    action('create game')({});
    return createGame();
  }

  async joinGame(gameCode: string): Promise<Game> {
    action('join game')(gameCode);
    return createGame({ code: gameCode });
  }

  async startGame(questionMaster: Player, turns: number): Promise<void> {
    action('start game')({ questionMaster, turns });
  }

  async answer(choices: Choice[]): Promise<void> {
    action('answer')({ choices });
  }

  async selectWinningAnswer(answer: Answer): Promise<void> {
    action('selectWinningAnswer')({ answer });
  }

  async endCurrentTurn(): Promise<void> {
    action('endCurrentTurn')({});
  }
}

export class StubPlayerGateway implements PlayerGateway {
  fetchMe(): Promise<Player | undefined> {
    throw new Error('Method not implemented.');
  }

  async login(nick: string): Promise<Player> {
    action('login')(nick);
    return createPlayer({ nick });
  }
}

export class StubRTCGateway implements RTCGateway {
  connect(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  onMessage(_listener: RTCListener): void {
    throw new Error('Method not implemented.');
  }
}
