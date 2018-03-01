// @flow

import * as React from 'react';
import SnackBar from 'material-ui/Snackbar';

import type { ErrorType } from 'Types/models';

type ErrorSnackBarProps = {|
  error: ErrorType,
  onClose: (SyntheticEvent<>, reason: string) => void,
|};

const ErrorSnackBar = ({ error, onClose }: ErrorSnackBarProps) => (
  <SnackBar
    open={!!error}
    message={error && error.detail}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  />
);

export default ErrorSnackBar;
