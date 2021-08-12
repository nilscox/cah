import { QueryHandler } from '../../../ddd/QueryHandler';
import { GameDto } from '../../../shared/dtos';
import { DtoMapperService } from '../../services/DtoMapperService';
import { GameService } from '../../services/GameService';

export class GetGameQuery {
  constructor(public readonly gameId: string) {}
}

export class GetGameHandler implements QueryHandler<GetGameQuery, GameDto> {
  constructor(private readonly gameService: GameService, private readonly dtoMapper: DtoMapperService) {}

  async execute({ gameId }: GetGameQuery) {
    return this.dtoMapper.gameToDto(await this.gameService.getGame(gameId));
  }
}
