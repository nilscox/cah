/* @refresh reload */
import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';

import { App } from './app';

import './styles.css';

Error.stackTraceLimit = Infinity;

const root = document.getElementById('root');

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root as HTMLElement,
);
