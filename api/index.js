const app = require('./src/app');
const { getEnv, info } = require('./src/utils');

const IP = getEnv('CAH_API_IP', 'localhost');
const PORT = getEnv('CAH_API_PORT', 4242);

app.listen(PORT, IP, () => info('SERVER', 'listening on ' + [IP, PORT].join(':')));
