import http from 'http';

import { app } from './web';
import { bootstrap } from './websocket';

const server = http.createServer(app);
bootstrap(server);

export { server as app };
