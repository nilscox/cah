import { useSelector } from 'react-redux';

import { selectGame } from '../../../store/selectors/gameSelectors';

export const useGame = () => {
  return useSelector(selectGame);
};
