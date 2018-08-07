const app = require('./src/app');
const { info } = require('./src/utils/logger');

const PORT = process.env.CAH_API_PORT || 4242;

info('SERVER', 'starting server on port', PORT);
app.listen(PORT);
