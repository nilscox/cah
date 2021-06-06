import http from 'http';

import { app } from './web';
import { WebsocketServer } from './websocket';

const server = http.createServer(app);
const wsServer = new WebsocketServer(server);

export { server as app, wsServer };
