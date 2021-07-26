import { main } from './infrastructure';

const hostname = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '4242');

const start = async () => {
  const server = await main();

  if (isNaN(port) || port <= 0) {
    throw new Error(`process.env.PORT = "${port}" is not a positive integer`);
  }

  await new Promise<void>((resolve) => server.listen(port, hostname, resolve));

  console.info(`server started on port ${port}`);
};

start().catch(console.error);
