const app = require('./app');

const PORT = process.env.CAH_API_PORT || 4242;

console.log('starting server on port ' + PORT);
app.listen(PORT);
