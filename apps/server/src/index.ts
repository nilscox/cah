import { createContainer } from './container';
import { TOKENS } from './tokens';

main().catch(console.error);

async function main() {
  const container = createContainer();

  const logger = container.resolve(TOKENS.logger);
  const server = container.resolve(TOKENS.server);
  const notifier = container.resolve(TOKENS.notifier);

  notifier.configure();
  await server.listen();

  const close = async (signal: string) => {
    logger.verbose(`received signal "${signal}"`);
    await server.close();
  };

  process.on('SIGTERM', (signal) => void close(signal));
  process.on('SIGINT', (signal) => void close(signal));
}
