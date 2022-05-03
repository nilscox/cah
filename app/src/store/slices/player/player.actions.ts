import { Choice } from '../../../domain/entities/Choice';
import { Player } from '../../../domain/entities/player';
import { getIds } from '../../../shared/getIds';

import { playerSlice } from './player.slice';

const {
  setPlayer,
  setConnected,
  initializeGame,
  addChoices,
  removeChoices,
  setSelection,
  addChoiceToSelection,
  removeChoiceFromSelection,
  setSelectionValidated,
  setCardsFlushed,
} = playerSlice.actions;

export const playerActions = {
  setPlayer(player: Player) {
    return setPlayer({ player });
  },

  setPlayerConnected(connected = true) {
    return setConnected({ connected });
  },

  initializePlayerGame(gameId: string) {
    return initializeGame({ gameId });
  },

  addChoices(choices: Choice[]) {
    return addChoices({ choices });
  },

  removeChoices(choices: Choice[]) {
    return removeChoices({ choiceIds: getIds(choices) });
  },

  resetSelection(size: number) {
    return setSelection({ selection: Array(size).fill(null) });
  },

  selectChoice(choice: Choice, index: number) {
    return addChoiceToSelection({ choiceId: choice.id, index });
  },

  unselectChoice(choice: Choice) {
    return removeChoiceFromSelection({ choiceId: choice.id });
  },

  setSelectionValidated(validated = true) {
    return setSelectionValidated({ validated });
  },

  setCardsFlushed() {
    return setCardsFlushed({ flushed: true });
  },
};
