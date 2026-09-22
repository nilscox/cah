import { type ICahClient } from '@cah/client';
import { type Mock } from 'vitest';

export class MockClient implements ICahClient {
  addEventListener: ICahClient['addEventListener'] = vi.fn();
  removeEventListener: ICahClient['removeEventListener'] = vi.fn();

  connect: Mock<ICahClient['connect']> = vi.fn();
  disconnect: Mock<ICahClient['disconnect']> = vi.fn();

  getGame: Mock<ICahClient['getGame']> = vi.fn();
  getGameTurns: Mock<ICahClient['getGameTurns']> = vi.fn();
  getAuthenticatedPlayer: Mock<ICahClient['getAuthenticatedPlayer']> = vi.fn();

  authenticate: Mock<ICahClient['authenticate']> = vi.fn();
  clearAuthentication: Mock<ICahClient['clearAuthentication']> = vi.fn();

  createGame: Mock<ICahClient['createGame']> = vi.fn();
  joinGame: Mock<ICahClient['joinGame']> = vi.fn();
  leaveGame: Mock<ICahClient['leaveGame']> = vi.fn();
  startGame: Mock<ICahClient['startGame']> = vi.fn();
  createAnswer: Mock<ICahClient['createAnswer']> = vi.fn();
  selectAnswer: Mock<ICahClient['selectAnswer']> = vi.fn();
  endTurn: Mock<ICahClient['endTurn']> = vi.fn();
}
