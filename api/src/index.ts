import { app } from './infrastructure/web';

const { PORT = '4242', HOST = '0.0.0.0' } = process.env;

const hostname = HOST;
const port = Number.parseInt(PORT);

if (isNaN(port) || port <= 0) {
  throw new Error(`process.env.PORT = "${PORT}" is not a positive integer`);
}

app.listen(port, hostname, () => console.log(`server started on port ${port}`));
