import http from 'http';

import { app, session } from './rest';
import { WebsocketGameEvents } from './websocket/WebsocketGameEvents';

const server = http.createServer(app);
const wsGameEvents = new WebsocketGameEvents(server, session);

export { server as app, wsGameEvents };
