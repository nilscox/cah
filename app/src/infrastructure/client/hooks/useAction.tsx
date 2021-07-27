import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';

import { ThunkResult } from '../../../store/createAction';
import { GuardSelector } from '../views/GameView/GameStartedView/PlayersAnswer';

export const useAction = <Args extends unknown[]>(
  guardSelector: GuardSelector,
  action: (...args: Args) => ThunkResult<unknown> | Action,
) => {
  const dispatch = useDispatch();
  const canPerform = useSelector(guardSelector);

  if (canPerform) {
    return (...args: Args) => dispatch(action(...args));
  }
};
