import { Choice } from './Choice';

export interface AnonymousAnswer {
  id: string;
  choices: Choice[];
  formatted: string;
}

export interface Answer extends AnonymousAnswer {
  player: string;
}

export const isNotAnonymous = (answer: AnonymousAnswer | Answer): answer is Answer => {
  return 'player' in answer;
};
