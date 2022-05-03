import { fn, Mock } from 'jest-mock';

import { GameGateway } from '../../domain/gateways/GameGateway';

export class MockGameGateway implements GameGateway {
  fetchGame: Mock<GameGateway['fetchGame']> = fn();
  fetchTurns: Mock<GameGateway['fetchTurns']> = fn();
  createGame: Mock<GameGateway['createGame']> = fn();
  joinGame: Mock<GameGateway['joinGame']> = fn();
  leaveGame: Mock<GameGateway['leaveGame']> = fn();
  startGame: Mock<GameGateway['startGame']> = fn();
  flushCards: Mock<GameGateway['flushCards']> = fn();
  answer: Mock<GameGateway['answer']> = fn();
  selectWinningAnswer: Mock<GameGateway['selectWinningAnswer']> = fn();
  endCurrentTurn: Mock<GameGateway['endCurrentTurn']> = fn();
}
