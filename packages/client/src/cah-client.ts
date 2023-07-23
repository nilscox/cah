import {
  AnonymousAnswer,
  AuthenticateBody,
  Choice,
  CreateAnswerBody,
  Game,
  GameEvent,
  Player,
  Question,
  StartGameBody,
  StartedGame,
  Turn,
  isStarted,
} from '@cah/shared';
import { Socket, io } from 'socket.io-client';

import { chalk } from './chalk';
import { Fetcher } from './fetcher';

type GameEventType = GameEvent['type'];
type GameEventsMap = { [T in GameEventType]: Extract<GameEvent, { type: T }> };
type GameEventListener<Type extends GameEventType> = (event: GameEventsMap[Type]) => void;

export class CahClient {
  private fetcher: Fetcher;
  private listeners: Map<string, Set<GameEventListener<GameEventType>>>;
  private socket?: Socket;

  constructor(private readonly baseUrl: string) {
    this.fetcher = new Fetcher(baseUrl);
    this.listeners = new Map();
  }

  get cookie() {
    return this.fetcher.cookie;
  }

  set cookie(value: string) {
    this.fetcher.cookie = value;
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
    this.socket = io(this.baseUrl.replace(/^http(s)?/, 'ws$1'), {
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

  async getGame(gameId: string): Promise<Game | StartedGame> {
    return inspectable(await this.fetcher.get<Game>(`/game/${gameId}`), inspectGame);
  }

  async getGameTurns(gameId: string): Promise<Turn[]> {
    return this.fetcher.get<Turn[]>(`/game/${gameId}/turns`);
  }

  async getAuthenticatedPlayer(): Promise<Player> {
    return inspectable(await this.fetcher.get<Player>('/player'), inspectPlayer);
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

const inspectable = <T>(obj: T, format: (obj: T) => string) => {
  Object.defineProperty(obj, Symbol.for('nodejs.util.inspect.custom'), {
    value: () => format(obj),
  });

  return obj;
};

const dimId = (id: string) => {
  return chalk.black(`(${id})`);
};

const inspectGame = (game: Game): string => {
  const lines = [`Game ${dimId(game.id)}`];

  lines.push(`- id: ${game.id}`);
  lines.push(`- code: ${game.code}`);
  lines.push(`- state: ${game.state}`);

  lines.push('- players:');
  for (const player of game.players) {
    lines.push(`  - ${player.nick} ${dimId(player.id)}`);
  }

  if (isStarted(game)) {
    const questionMaster = game.players.find((player) => player.id === game.questionMasterId);
    lines.push(`- questionMaster: ${questionMaster?.nick}`);

    lines.push(`- question: ${inspectQuestion(game.question)}`);

    if (game.answers.length > 0) {
      lines.push('- answers:');

      lines.push(
        ...list(game.answers, (answer) => {
          const f = answer.id === game.selectedAnswerId ? chalk.green : (s: string) => s;
          const playerId = 'playerId' in answer && answer.playerId;

          const parts = [
            inspectQuestion(game.question, answer.choices),
            dimId(answer.id),
            playerId && chalk.light(`${game.players.find(({ id }) => id === playerId)?.nick}`),
          ].filter(Boolean);

          return f(parts.join(' '));
        }),
      );
    }
  }

  return lines.join('\n');
};

const inspectQuestion = (question: Question, choices?: Choice[]): string => {
  const blanks = question.blanks;
  let text = question.text;

  const getBlankValue = (index: number) => {
    const choice = choices?.[index];

    if (!choice) {
      return '__';
    }

    if (choice.caseSensitive || blanks === undefined) {
      return choice.text;
    }

    return choice.text.toLowerCase();
  };

  if (blanks === undefined) {
    return [text, chalk.bold(getBlankValue(0))].join(' ');
  }

  for (const [i, place] of Object.entries(blanks.slice().reverse())) {
    text = [text.slice(0, place), text.slice(place)].join(
      chalk.bold(getBlankValue(blanks.length - Number(i) - 1)),
    );
  }

  return text;
};

const inspectPlayer = (player: Player): string => {
  const lines = [`Player ${dimId(player.id)}`];

  lines.push(`- id: ${player.id}`);
  lines.push(`- nick: ${player.nick}`);
  lines.push(`- gameId: ${player.gameId}`);

  if (player.cards) {
    lines.push('- cards:');
    lines.push(...list(player.cards, (card) => card.text));
  }

  return lines.join('\n');
};

const list = <T>(items: T[], inspectItem: (item: T) => string): string[] => {
  return items.map((item, index) => `  ${String(index + 1).padStart(2)}. ${inspectItem(item)}`);
};