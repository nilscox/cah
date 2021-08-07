import React, { ErrorInfo } from 'react';

import { Center } from '../layout/Center';
import { FullScreen } from '../layout/FullScreen';

export const Fallback: React.FC = () => (
  <FullScreen>
    <Center flex={1}>Y'a eu une erreur.</Center>
  </FullScreen>
);

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
      return <Fallback />;
    }

    return this.props.children;
  }
}
