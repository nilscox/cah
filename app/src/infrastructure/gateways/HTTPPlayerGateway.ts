import { FullPlayerDto } from '../../../../shared/dtos';
import { Player } from '../../domain/entities/Player';
import { PlayerGateway } from '../../domain/gateways/PlayerGateway';

import { HTTPAdapter } from './HTTPAdapter';

export class HTTPPlayerGateway implements PlayerGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async fetchMe(): Promise<Player | undefined> {
    const { body, status } = await this.http.get<FullPlayerDto>('/player/me', {
      expectedStatus: [200, 401],
    });

    if (status === 200) {
      return body;
    }
  }

  async login(nick: string): Promise<Player> {
    const { body } = await this.http.post<FullPlayerDto>('/login', {
      nick,
    });

    return body;
  }
}
