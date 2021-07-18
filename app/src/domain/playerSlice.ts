import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  nick: string;
}

const initialState: PlayerState = {
  nick: '',
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setNick: (state, { payload: nick }: PayloadAction<string>) => {
      state.nick = nick;
    },
  },
});

export const { setNick } = playerSlice.actions;
