import React from 'react';
import SnackBar from 'material-ui/Snackbar';

const ErrorSnackBar = ({ error, onClose }) => (
  <SnackBar
    open={!!error}
    message={error && error.body.detail}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  />
);

export default ErrorSnackBar;
