const app = require('./src/app');
const config = require('./src/config');
const { info } = require('./src/log');

const { listenIP: IP, listenPort: PORT } = config;

// info('SERVER', 'config', JSON.stringify(config, 2, 2));

app.listen(PORT, IP, () => info('SERVER',
  'listening on ' + [IP, PORT].join(':')),
);
