import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Choice } from '../../../domain/entities/Choice';
import { Player, PlayerGame } from '../../../domain/entities/player';

const playerGameReducer = <Payload>(reducer: CaseReducer<PlayerGame, PayloadAction<Payload>>) => {
  return (player: Player, action: PayloadAction<Payload>) => {
    if (player.game === null) {
      throw new Error('playerGameReducer: player.game is null');
    }

    reducer(player.game, action);
  };
};

const initialState: Player = {
  id: '',
  nick: '',
  isConnected: false,
  game: null,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer(_, { payload }: PayloadAction<{ player: Player }>) {
      return payload.player;
    },
    setConnected: (player, { payload }: PayloadAction<{ connected: boolean }>) => {
      const { connected } = payload;

      player.isConnected = connected;
    },
    initializeGame: (player, { payload }: PayloadAction<{ gameId: string }>) => {
      const { gameId } = payload;

      player.game = {
        gameId,
        cards: {},
        selection: [],
        selectionValidated: false,
        hasFlushed: false,
      };
    },
    addChoices: playerGameReducer<{ choices: Choice[] }>((game, { payload }) => {
      const { choices } = payload;

      for (const choice of choices) {
        game.cards[choice.id] = choice;
      }
    }),
    removeChoices: playerGameReducer<{ choiceIds: string[] }>((game, { payload }) => {
      const { choiceIds } = payload;

      for (const choiceId of choiceIds) {
        delete game.cards[choiceId];
      }
    }),
    setSelection: playerGameReducer<{ selection: PlayerGame['selection'] }>((game, { payload }) => {
      const { selection } = payload;

      game.selection = selection;
    }),
    addChoiceToSelection: playerGameReducer<{ choiceId: string; index: number }>((game, { payload }) => {
      const { choiceId, index } = payload;

      game.selection[index] = choiceId;
    }),
    removeChoiceFromSelection: playerGameReducer<{ choiceId: string }>((game, { payload }) => {
      const { choiceId } = payload;
      const index = game.selection.indexOf(choiceId);

      if (index >= 0) {
        game.selection[index] = null;
      }
    }),
    setSelectionValidated: playerGameReducer<{ validated: boolean }>((game, { payload }) => {
      const { validated } = payload;

      game.selectionValidated = validated;
    }),
    setCardsFlushed: playerGameReducer<{ flushed: boolean }>((game, { payload }) => {
      const { flushed } = payload;

      game.hasFlushed = flushed;
    }),
  },
});
