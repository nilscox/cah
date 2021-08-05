import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';

import { ThunkResult } from '../../../store/createAction';
import { AppState } from '../../../store/types';

type GuardSelector = (state: AppState) => boolean;

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
