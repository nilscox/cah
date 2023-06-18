import { container } from './container';
import { TOKENS } from './tokens';

main().catch(console.error);

async function main() {
  const server = container.resolve(TOKENS.server);

  await server.listen();
  console.log('server started');

  const close = async (signal: string) => {
    console.log(`received signal "${signal}"`);
    await server.close();
    console.log('server closed');
  };

  process.on('SIGTERM', (signal) => void close(signal));
  process.on('SIGINT', (signal) => void close(signal));
}
