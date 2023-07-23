import { Command } from 'commander';
import { CahClient } from '@cah/client';

const program = new Command();

program.name('Cards Against Humanity CLI');
program.description('CLI client for CAH');
program.configureHelp({ showGlobalOptions: true });
program.showHelpAfterError();

program.option('-u --base-url <url>', 'base url of the api server', 'localhost:3000');

program
  .command('get-game <gameId>')
  .description('retrieves a game from its id')
  .action(async (gameId, options) => {
    const baseUrl = program.opts().baseUrl;
    const client = new CahClient(baseUrl);

    console.log(await client.getGame(gameId));
  });

await program.parseAsync();
