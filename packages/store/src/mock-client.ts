import { ICahClient } from '@cah/client/src';
import { Mock } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn<F extends (...args: any[]) => any> = Mock<Parameters<F>, ReturnType<F>>;

export class MockClient implements ICahClient {
  addEventListener: ICahClient['addEventListener'] = vi.fn();
  removeEventListener: ICahClient['removeEventListener'] = vi.fn();

  connect: MockFn<ICahClient['connect']> = vi.fn();
  disconnect: MockFn<ICahClient['disconnect']> = vi.fn();

  getGame: MockFn<ICahClient['getGame']> = vi.fn();
  getGameTurns: MockFn<ICahClient['getGameTurns']> = vi.fn();
  getAuthenticatedPlayer: MockFn<ICahClient['getAuthenticatedPlayer']> = vi.fn();
  authenticate: MockFn<ICahClient['authenticate']> = vi.fn();
  createGame: MockFn<ICahClient['createGame']> = vi.fn();
  joinGame: MockFn<ICahClient['joinGame']> = vi.fn();
  leaveGame: MockFn<ICahClient['leaveGame']> = vi.fn();
  startGame: MockFn<ICahClient['startGame']> = vi.fn();
  createAnswer: MockFn<ICahClient['createAnswer']> = vi.fn();
  selectAnswer: MockFn<ICahClient['selectAnswer']> = vi.fn();
  endTurn: MockFn<ICahClient['endTurn']> = vi.fn();
}
