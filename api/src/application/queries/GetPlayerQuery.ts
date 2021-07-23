import { FullPlayerDto, PlayerDto } from '../../../../shared/dtos';
import { QueryHandler } from '../../ddd/QueryHandler';
import { PlayerNotFoundError } from '../../domain/errors/PlayerNotFoundError';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { SessionStore } from '../interfaces/SessionStore';
import { DtoMapperService } from '../services/DtoMapperService';

export class GetPlayerQuery {
  constructor(public readonly playerId: string) {}
}

export class GetPlayerHandler implements QueryHandler<GetPlayerQuery, PlayerDto | FullPlayerDto, SessionStore> {
  constructor(private readonly playerRepository: PlayerRepository, private readonly dtoMapper: DtoMapperService) {}

  async execute({ playerId }: GetPlayerQuery, session: SessionStore) {
    const player = await this.playerRepository.findPlayerById(playerId);

    if (!player) {
      throw new PlayerNotFoundError();
    }

    if (!session.player?.equals(player)) {
      return this.dtoMapper.toPlayerDto(player);
    }

    return this.dtoMapper.toFullPlayerDto(player);
  }
}
