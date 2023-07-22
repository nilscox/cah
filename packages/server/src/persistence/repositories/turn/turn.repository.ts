import * as shared from '@cah/shared';

import { Turn } from 'src/entities';

export interface TurnRepository {
  query(turnId: string): Promise<shared.Turn>;

  insert(turn: Turn): Promise<void>;
}
