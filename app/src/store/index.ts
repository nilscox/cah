import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as reduxUseDispatch, useSelector as reduxUseSelector } from 'react-redux';

import { playerSlice } from '../domain/playerSlice';

export const createStore = () => {
  return configureStore({
    reducer: {
      player: playerSlice.reducer,
    },
  });
};

export type Store = ReturnType<typeof createStore>;

export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];

export const useDispatch = () => reduxUseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;
