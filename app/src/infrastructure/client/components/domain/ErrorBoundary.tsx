import React, { ErrorInfo } from 'react';

import { Center } from '../layout/Center';
import { FullScreen } from '../layout/FullScreen';

export class ErrorBoundary extends React.PureComponent<unknown, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FullScreen>
          <Center>Ya eu une erreur.</Center>
        </FullScreen>
      );
    }

    return this.props.children;
  }
}
