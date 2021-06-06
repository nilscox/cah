import request from 'supertest';
import Container from 'typedi';

import { Player } from '../domain/entities/Player';
import { Authenticate } from '../domain/use-cases/Authenticate';
import { CreateGame } from '../domain/use-cases/CreateGame';
import { QueryGame } from '../domain/use-cases/QueryGame';
import { QueryPlayer } from '../domain/use-cases/QueryPlayer';

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

export const auth = (player: Player) => {
  const agent = request.agent(app);

  before(async () => {
    mockAuthenticate(() => Promise.resolve({ player, created: false }));
    mockQueryPlayer(() => Promise.resolve(player));

    await agent.post('/api/player').expect(200);
  });

  return agent;
};
