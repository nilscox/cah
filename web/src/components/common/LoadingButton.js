import React from 'react';
import Button from 'material-ui/Button';
import {CircularProgress} from 'material-ui/Progress';

const LoadingButton = ({ loading, ...props }) => (
  <Button {...props}>
    {loading ?
      <CircularProgress size={25} thickness={2}/> :
      props.children
    }
  </Button>
);

export default LoadingButton;
