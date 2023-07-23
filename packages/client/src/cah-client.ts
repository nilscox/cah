import {
  AnonymousAnswer,
  AuthenticateBody,
  Choice,
  CreateAnswerBody,
  Game,
  GameEvent,
  Player,
  StartGameBody,
  Turn,
} from '@cah/shared';
import { Socket, io } from 'socket.io-client';

import { Fetcher } from './fetcher';

type GameEventType = GameEvent['type'];
type GameEventsMap = { [T in GameEventType]: Extract<GameEvent, { type: T }> };
type GameEventListener<Type extends GameEventType> = (event: GameEventsMap[Type]) => void;

export class CahClient {
  private fetcher: Fetcher;
  private listeners: Map<string, Set<GameEventListener<GameEventType>>>;
  private socket?: Socket;

  constructor(private readonly baseUrl: string) {
    this.fetcher = new Fetcher(`http://${baseUrl}`);
    this.listeners = new Map();
  }

  addEventListener<Type extends GameEventType>(type: Type, listener: GameEventListener<Type>) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(listener as GameEventListener<GameEventType>);
  }

  removeEventListener<Type extends GameEventType>(type: Type, listener: GameEventListener<Type>) {
    this.listeners.get(type)?.delete(listener as GameEventListener<GameEventType>);
  }

  async connect() {
    this.socket = io(`ws://${this.baseUrl}`, {
      extraHeaders: { cookie: this.fetcher.cookie },
    });

    this.socket.on('message', (event: GameEvent) => {
      this.listeners.get(event.type)?.forEach((listener) => listener(event));
    });

    await new Promise<void>((resolve) => this.socket?.once('connect', resolve));
  }

  async disconnect() {
    const socket = this.socket;

    if (!socket) {
      throw new Error('Not connected');
    }

    return new Promise<void>((resolve) => {
      socket.once('disconnect', () => resolve());
      return socket.disconnect();
    });
  }

  async getGame(gameId: string): Promise<Game> {
    return this.fetcher.get<Game>(`/game/${gameId}`);
  }

  async getGameTurns(gameId: string): Promise<Turn[]> {
    return this.fetcher.get<Turn[]>(`/game/${gameId}/turns`);
  }

  async getAuthenticatedPlayer(): Promise<Player> {
    return this.fetcher.get<Player>('/player');
  }

  async authenticate(nick: string): Promise<void> {
    return this.fetcher.post<AuthenticateBody>('/authenticate', { nick });
  }

  async createGame(): Promise<void> {
    return this.fetcher.post('/game');
  }

  async joinGame(code: string): Promise<void> {
    return this.fetcher.put(`/game/${code}/join`);
  }

  async leaveGame(): Promise<void> {
    return this.fetcher.put('/game/leave');
  }

  async startGame(numberOfQuestions: number): Promise<void> {
    return this.fetcher.put<StartGameBody>('/game/start', { numberOfQuestions });
  }

  async createAnswer(choices: Choice[]): Promise<void> {
    return this.fetcher.post<CreateAnswerBody>('/game/answer', { choicesIds: choices.map(({ id }) => id) });
  }

  async selectAnswer(answer: AnonymousAnswer): Promise<void> {
    return this.fetcher.put(`/game/answer/${answer.id}/select`);
  }

  async endTurn(): Promise<void> {
    return this.fetcher.put('/game/end-turn');
  }
}
