const app = require('./app');
const { info } = require('./utils/logger');

const PORT = process.env.CAH_API_PORT || 4242;

info('SERVER', 'starting server on port', PORT);
app.listen(PORT);
