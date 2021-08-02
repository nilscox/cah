import { TurnDto } from '../../../../../shared/dtos';
import { QueryHandler } from '../../../ddd/QueryHandler';
import { GameRepository } from '../../interfaces/GameRepository';
import { SessionStore } from '../../interfaces/SessionStore';
import { DtoMapperService } from '../../services/DtoMapperService';

export class GetTurnsQuery {
  constructor(public readonly gameId: string) {}
}

export class GetTurnsHandler implements QueryHandler<GetTurnsQuery, TurnDto[], SessionStore> {
  constructor(private readonly gameRepository: GameRepository, private readonly dtoMapper: DtoMapperService) {}

  async execute({ gameId }: GetTurnsQuery, _: SessionStore): Promise<TurnDto[]> {
    const turns = await this.gameRepository.findTurns(gameId);

    return turns.map(this.dtoMapper.turnToDto);
  }
}
