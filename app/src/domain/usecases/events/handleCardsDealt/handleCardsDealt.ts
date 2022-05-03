import { CardsDealtEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { setCards } from '../../player/setCards/setCards';

export const handleCardsDealt = createThunk(({ dispatch }, event: CardsDealtEvent) => {
  dispatch(setCards(event.cards));
});
