import { container } from './container';
import { TOKENS } from './tokens';

main().catch(console.error);

async function main() {
  const server = container.resolve(TOKENS.server);

  await server.listen();
  console.log('server started');
}
