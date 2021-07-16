import { io, Socket } from 'socket.io-client';
import request from 'supertest';

import { DomainEvent } from './ddd/EventPublisher';
import { Choice } from './domain/models/Choice';
import { server } from './infrastructure/web';

const port = 4444;
const log = false;

const randInt = (min: number, max: number) => ~~(Math.random() * (max - min + 1)) + min;

class StubPlayer {
  private agent = request.agent(server);
  private socket?: Socket;

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

  close() {
    this.socket?.close();
  }

  private log(message: string) {
    if (log) {
      console.log(`${this.nick} ${message}`);
    }
  }

  private logEvent(type: string) {
    if (log && this.nick === 'nils') {
      console.log(`event: ${type}`);
    }
  }

  private handleEvent(event: any) {
    this.logEvent(event.type);

    switch (event.type) {
      case 'GameJoined':
      case 'PlayerAnswered':
        break;

      case 'GameStarted':
        this.gameState = 'started';
        this.playState = 'playersAnswer';
        break;

      case 'GameFinished':
        this.gameState = 'finished';
        this.playState = undefined;
        break;

      case 'TurnStarted':
        this.questionMaster = event.questionMaster;
        this.question = event.question;
        break;

      case 'TurnFinished':
        this.questionMaster = undefined;
        this.question = undefined;
        this.answers = [];
        this.winner = undefined;
        break;

      case 'AllPlayersAnswered':
        this.answers = event.answers;
        this.playState = 'questionMasterSelection';
        break;

      case 'WinnerSelected':
        this.answers = event.answers;
        this.winner = event.winner;
        break;

      case 'CardsDealt':
        this.cards.push(...event.cards);
        break;

      default:
        throw new Error('Unknown event recieved: ' + JSON.stringify(event));
    }

    this.events.push(event);
  }

  async authenticate() {
    const { body: player } = await this.agent.post('/login').send({ nick: this.nick }).expect(200);

    this.playerId = player.id;

    const cookie = this.agent.jar.getCookie('connect.sid', {
      domain: 'localhost',
      path: '/',
      script: false,
      secure: false,
    });

    this.socket = io(`ws://localhost:${port}`, {
      extraHeaders: {
        cookie: [cookie?.name, cookie?.value].join('='),
      },
    });

    await new Promise<void>((resolve) => this.socket?.on('connect', resolve));
    this.socket.on('message', (event) => this.handleEvent(event));
  }

  async createGame() {
    this.log('creates a game');

    const { body: game } = await this.agent.post('/game').expect(201);

    this.gameId = game.id;

    return this.gameId as string;
  }

  async joinGame(gameId: string) {
    this.log(`joins the game ${gameId}`);

    await this.agent.post(`/game/${gameId}/join`).expect(200);
    this.gameId = gameId;
  }

  async startGame(questionMaster: StubPlayer, turns: number) {
    this.log(`starts the game, with ${turns} turns and ${questionMaster.nick} as first question master`);

    await this.agent.post(`/start`).send({ questionMasterId: questionMaster.playerId, turns }).expect(200);
  }

  async giveRandomChoicesSelection() {
    const selection = [];

    for (let i = 0; i < this.question!.numberOfBlanks; ++i) {
      if (this.cards.length === 0) {
        throw new Error('player has no more cards');
      }

      selection.push(...this.cards.splice(randInt(0, this.cards.length - 1), 1));
    }

    if (selection.length !== this.question?.numberOfBlanks) {
      throw new Error('not enough cards to create a selection');
    }

    this.log(`answers ${JSON.stringify(selection)}`);

    await this.agent
      .post(`/answer`)
      .send({ choicesIds: selection.map((choice) => choice.id) })
      .expect(200);
  }

  async pickRandomAnswer() {
    const answerIndex = randInt(0, this.answers.length - 1);
    const answer = this.answers[answerIndex];

    if (!answer) {
      throw new Error('no answer to pick');
    }

    this.log(`randomly picks ${JSON.stringify(answer)}`);

    await this.agent.post(`/select`).send({ answerId: answer.id }).expect(200);
  }

  async endCurrentTurn() {
    this.log(`ends the current turn`);

    await this.agent.post(`/next`).expect(200);
  }
}

describe('e2e', function () {
  this.slow(300);

  let nils: StubPlayer;
  let tom: StubPlayer;
  let jeanne: StubPlayer;

  let players: StubPlayer[];

  before(() => {
    nils = new StubPlayer('nils');
    tom = new StubPlayer('tom');
    jeanne = new StubPlayer('jeanne');

    players = [nils, tom, jeanne];
  });

  before((done) => {
    server.listen(port, done);
  });

  after((done) => {
    nils.close();
    tom.close();
    jeanne.close();

    server.close(done);
  });

  const questionMaster = () => {
    return players.find((player) => player.isQuestionMaster);
  };

  const playersExcludingQM = () => {
    return players.filter((player) => !player.isQuestionMaster);
  };

  it('plays a full game', async () => {
    for (const player of players) {
      await player.authenticate();
    }

    const gameId = await nils.createGame();

    for (const player of [tom, jeanne]) {
      await player.joinGame(gameId);
    }

    await tom.startGame(jeanne, 4);

    while (questionMaster()) {
      for (const player of playersExcludingQM()) {
        await player.giveRandomChoicesSelection();
      }

      await questionMaster()?.pickRandomAnswer();
      await questionMaster()?.endCurrentTurn();
    }

    // console.log({ nils, tom, jeanne });
  });
});
