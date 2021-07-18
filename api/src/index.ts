import { bootstrapServer } from './infrastructure/web';

const { PORT = '4242', HOST = '0.0.0.0' } = process.env;

const hostname = HOST;
const port = Number.parseInt(PORT);

const main = async () => {
  const server = await bootstrapServer();

  if (isNaN(port) || port <= 0) {
    throw new Error(`process.env.PORT = "${PORT}" is not a positive integer`);
  }

  await new Promise<void>((resolve) => server.listen(port, hostname, resolve));
  console.info(`server started on port ${port}`);
};

main().catch(console.error);
