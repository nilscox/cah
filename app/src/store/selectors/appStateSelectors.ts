import { AppState } from '../types';

export const selectMenuOpen = (state: AppState) => state.app.menuOpen;
