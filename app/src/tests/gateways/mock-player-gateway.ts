import { fn } from 'jest-mock';

import { PlayerGateway } from '../../domain/gateways/PlayerGateway';

export class MockPlayerGateway implements PlayerGateway {
  fetchMe = fn<PlayerGateway['fetchMe']>();
  login = fn<PlayerGateway['login']>();
  logout = fn<PlayerGateway['logout']>();
}
