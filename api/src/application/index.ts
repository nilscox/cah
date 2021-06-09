import http from 'http';

import { app, session } from './web';
import { WebsocketGameEvents } from './websocket';

const server = http.createServer(app);
const wsGameEvents = new WebsocketGameEvents(server, session);

export { server as app, wsGameEvents };
