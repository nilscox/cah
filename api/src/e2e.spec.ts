import request from 'supertest';

import { DomainEvent } from './ddd/EventPublisher';
import { Choice } from './domain/models/Choice';
import { app } from './infrastructure/web';

const randInt = (min: number, max: number) => ~~(Math.random() * (max - min + 1)) + min;

class StubPlayer {
  private agent = request.agent(app);

  public gameId?: string;
  public playerId?: string;

  public gameState: 'idle' | 'started' | 'finished' = 'idle';
  public playState?: 'playersAnswer' | 'questionMasterSelection' | 'endOfTurn';

  public cards: Choice[] = [];
  public questionMaster?: string;
  public question?: { text: string; numberOfBlanks: number };

  public answers: { id: number; choices: { text: string }[]; player?: string }[] = [];
  public winner?: string;

  public events: DomainEvent[] = [];

  get isQuestionMaster() {
    return this.questionMaster === this.nick;
  }

  constructor(public nick: string) {}

  async refresh() {
    const { body: game } = await this.agent.get(`/game/${this.gameId}`).expect(200);
    const { body: player } = await this.agent.get(`/player/${this.playerId}`).expect(200);

    this.gameState = game.gameState;
    this.playState = game.playState;

    this.cards = player.cards;
    this.questionMaster = game.questionMaster;
    this.question = game.question;

    this.answers = game.answers;
    this.winner = game.winner;
  }

  async login() {
    const { body: player } = await this.agent.post('/login').send({ nick: this.nick }).expect(200);

    this.playerId = player.id;
  }

  async createGame() {
    const { body: game } = await this.agent.post('/game').expect(201);

    this.gameId = game.id;

    return this.gameId as string;
  }

  async joinGame(gameId: string) {
    await this.agent.post(`/game/${gameId}/join`).expect(200);
    this.gameId = gameId;
  }

  async startGame(questionMasterId: string, turns: number) {
    await this.agent.post(`/start`).send({ questionMasterId, turns }).expect(200);
  }

  async giveRandomChoicesSelection() {
    const selection = [];

    for (let i = 0; i < this.question!.numberOfBlanks; ++i) {
      if (this.cards.length === 0) {
        throw new Error('player has no more cards');
      }

      selection.push(...this.cards.splice(randInt(0, this.cards.length - 1), 1));
    }

    await this.agent
      .post(`/answer`)
      .send({ choicesIds: selection.map((choice) => choice.id) })
      .expect(200);
  }

  async pickRandomAnswer() {
    const answerIndex = randInt(0, this.answers.length - 1);

    await this.agent.post(`/select`).send({ answerId: this.answers[answerIndex] }).expect(200);
  }

  async endCurrentTurn() {
    await this.agent.post(`/next`).expect(200);
  }
}

describe('e2e', () => {
  const refreshPlayers = async (players: StubPlayer[]) => {
    for (const player of players) {
      await player.refresh();
    }
  };

  it('plays a full game', async () => {
    const nils = new StubPlayer('nils');
    const tom = new StubPlayer('tom');
    const jeanne = new StubPlayer('jeanne');

    const players = [nils, tom, jeanne];

    const questionMaster = () => {
      return [nils, tom, jeanne].find((player) => player.isQuestionMaster);
    };

    const playersExcludingQM = () => {
      return [nils, tom, jeanne].filter((player) => !player.isQuestionMaster);
    };

    for (const player of players) {
      await player.login();
    }

    const gameId = await nils.createGame();

    for (const player of [tom, jeanne]) {
      await player.joinGame(gameId);
    }

    await tom.startGame(jeanne.playerId!, 4);

    await refreshPlayers(players);

    while (questionMaster()) {
      for (const player of playersExcludingQM()) {
        await player.giveRandomChoicesSelection();
      }

      await refreshPlayers(players);

      await questionMaster()?.pickRandomAnswer();
      await questionMaster()?.endCurrentTurn();

      await refreshPlayers(players);
    }

    // console.log({ nils, tom, jeanne });
  });
});
