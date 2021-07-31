import { useSelector } from 'react-redux';

import { selectPlayer } from '../../../store/selectors/playerSelectors';

export const usePlayer = () => {
  return useSelector(selectPlayer);
};
