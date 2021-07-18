import { Player } from '../../interfaces/entities/Player';
import { PlayerGateway } from '../../interfaces/gateways/PlayerGateway';

import { HTTPAdapter } from './HTTPAdapter';

export class HTTPPlayerGateway implements PlayerGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async fetchMe(): Promise<Player | undefined> {
    const { body, status } = await this.http.get<Player>('http://localhost:4242/player/me', {
      expectedStatus: [200, 401],
    });

    if (status === 200) {
      return body;
    }
  }

  async login(nick: string): Promise<Player> {
    const { body } = await this.http.post<Player>('http://localhost:4242/login', {
      nick,
    });

    return body;
  }
}
