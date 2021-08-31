import { Choice } from './Choice';
import { Player } from './Player';

export interface AnonymousAnswer {
  id: string;
  choices: Choice[];
  formatted: string;
}

export interface Answer extends AnonymousAnswer {
  player: Player;
}

export const isNotAnonymous = (answer: AnonymousAnswer | Answer): answer is Answer => {
  return 'player' in answer;
};
