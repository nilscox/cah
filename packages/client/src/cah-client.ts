import {
  AuthenticateBody,
  CreateAnswerBody,
  Game,
  GameEvent,
  GameEventType,
  GameEventsMap,
  CurrentPlayer,
  StartGameBody,
  StartedGame,
  Turn,
} from '@cah/shared';
import { Socket, io } from 'socket.io-client';

import { Fetcher } from './fetcher';
import { ServerFetcher } from './server-fetcher';

export type GameEventListener<Type extends GameEventType> = (event: GameEventsMap[Type]) => void;

export interface ICahClient {
  addEventListener<Type extends GameEventType>(type: Type, listener: GameEventListener<Type>): void;
  removeEventListener<Type extends GameEventType>(type: Type, listener: GameEventListener<Type>): void;

  connect(): void;
  disconnect(): void;

  getGame(gameId: string): Promise<Game | StartedGame>;
  getGameTurns(gameId: string): Promise<Turn[]>;
  getAuthenticatedPlayer(): Promise<CurrentPlayer>;

  authenticate(nick: string): Promise<void>;
  clearAuthentication(): Promise<void>;

  createGame(): Promise<string>;
  joinGame(code: string): Promise<string>;
  leaveGame(): Promise<void>;
  startGame(numberOfQuestions: number): Promise<void>;
  createAnswer(choicesIds: string[]): Promise<void>;
  selectAnswer(answerId: string): Promise<void>;
  endTurn(): Promise<void>;
}

export class CahClient implements ICahClient {
  private listeners = new Map<string, Set<GameEventListener<GameEventType>>>();
  private socket?: Socket;

  constructor(private readonly fetcher: Fetcher) {}

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
    const extraHeaders: Record<string, string> = {};

    if (this.fetcher instanceof ServerFetcher) {
      extraHeaders.cookie = this.fetcher.cookie;
    }

    this.socket = io(this.fetcher.baseUrl.replace(/\/api$/, ''), {
      transports: ['websocket', 'polling'],
      extraHeaders,
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

  async getGame(gameId: string): Promise<Game | StartedGame> {
    return this.fetcher.get<Game | StartedGame>(`/game/${gameId}`);
  }

  async getGameTurns(gameId: string): Promise<Turn[]> {
    return this.fetcher.get<Turn[]>(`/game/${gameId}/turns`);
  }

  async getAuthenticatedPlayer(): Promise<CurrentPlayer> {
    return this.fetcher.get<CurrentPlayer>('/player');
  }

  async authenticate(nick: string): Promise<void> {
    return this.fetcher.post<AuthenticateBody>('/authenticate', { nick });
  }

  async clearAuthentication(): Promise<void> {
    return this.fetcher.delete('/authentication');
  }

  async createGame(): Promise<string> {
    return this.fetcher.post<never, string>('/game');
  }

  async joinGame(code: string): Promise<string> {
    return this.fetcher.put<never, string>(`/game/${code}/join`);
  }

  async leaveGame(): Promise<void> {
    return this.fetcher.put('/game/leave');
  }

  async startGame(numberOfQuestions: number): Promise<void> {
    return this.fetcher.put<StartGameBody>('/game/start', { numberOfQuestions });
  }

  async createAnswer(choicesIds: string[]): Promise<void> {
    return this.fetcher.post<CreateAnswerBody>('/game/answer', { choicesIds });
  }

  async selectAnswer(answerId: string): Promise<void> {
    return this.fetcher.put(`/game/answer/${answerId}/select`);
  }

  async endTurn(): Promise<void> {
    return this.fetcher.put('/game/end-turn');
  }
}
