import { io, Socket } from 'socket.io-client';
import request, { SuperAgentTest } from 'supertest';
import Container from 'typedi';

import { Player } from '../domain/entities/Player';
import { Authenticate } from '../domain/use-cases/Authenticate';
import { CreateGame } from '../domain/use-cases/CreateGame';
import { GiveChoicesSelection } from '../domain/use-cases/GiveChoicesSelection';
import { JoinGame } from '../domain/use-cases/JoinGame';
import { NextTurn } from '../domain/use-cases/NextTurn';
import { PickWinningAnswer } from '../domain/use-cases/PickWinningAnswer';
import { QueryGame } from '../domain/use-cases/QueryGame';
import { QueryPlayer } from '../domain/use-cases/QueryPlayer';
import { StartGame } from '../domain/use-cases/StartGame';

import { app } from './index';

export const mockAuthenticate = (authenticate: Authenticate['authenticate']) => {
  Container.set(Authenticate, { authenticate });
};

export const mockQueryPlayer = (queryPlayer: QueryPlayer['queryPlayer']) => {
  Container.set(QueryPlayer, { queryPlayer });
};

export const mockQueryGame = (queryGame: QueryGame['queryGame']) => {
  Container.set(QueryGame, { queryGame });
};

export const mockCreateGame = (createGame: CreateGame['createGame']) => {
  Container.set(CreateGame, { createGame });
};

export const mockJoinGame = (joinGame: JoinGame['joinGame']) => {
  Container.set(JoinGame, { joinGame });
};

export const mockStartGame = (startGame: StartGame['startGame']) => {
  Container.set(StartGame, { startGame });
};

export const mockGiveChoicesSelection = (giveChoicesSelection: GiveChoicesSelection['giveChoicesSelection']) => {
  Container.set(GiveChoicesSelection, { giveChoicesSelection });
};

export const mockPickWinningAnswer = (pickWinningAnswer: PickWinningAnswer['pickWinningAnswer']) => {
  Container.set(PickWinningAnswer, { pickWinningAnswer });
};

export const mockNextTurn = (nextTurn: NextTurn['nextTurn']) => {
  Container.set(NextTurn, { nextTurn });
};

type AgentWithSocket = SuperAgentTest & { socket?: Socket };

export const auth = (player: Player, websocketPort?: number) => {
  const agent: AgentWithSocket = request.agent(app);

  beforeEach(async () => {
    mockAuthenticate(() => Promise.resolve({ player, created: false }));
    mockQueryPlayer(() => Promise.resolve(player));

    await agent.post('/api/player').expect(200);
  });

  if (websocketPort) {
    beforeEach((done) => {
      const cookie = agent.jar.getCookie('connect.sid', {
        domain: 'localhost',
        path: '/',
        script: false,
        secure: false,
      });

      agent.socket = io(`ws://localhost:${websocketPort}`, {
        extraHeaders: {
          cookie: [cookie?.name, cookie?.value].join('='),
        },
      });

      agent.socket.on('connect', done);
    });

    afterEach(() => {
      agent.socket?.close();
    });
  }

  return agent;
};
