import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createTypeormConnection } from '../index';

import { CahCli } from './CahCli';

const parser = yargs(hideBin(process.argv))
  .demandCommand(1, 1, 'missing command') // min, max
  .command('serve', 'start the server')
  .command('info [player]', 'log information about the server')
  .command('reset', 'reset the server')
  .command('create-player <nick>', 'create a new player')
  .command('create-game', 'create a new game')
  .command('join <code>', 'join an existing game')
  .command('start <questionMaster> <turns>', 'start a game')
  .command('answer <choices...>', 'answer a set of choices')
  .command('select <answer>', 'select a winning answer')
  .command('next', 'end the current turn')
  .option('as', { alias: 'a', type: 'string', description: 'execute the command as a player' })
  .option('quiet', { alias: 'q', type: 'boolean', description: 'disable logging' })
  .option('verbose', { alias: 'v', type: 'boolean', description: 'verbose logging' });

const cli = async () => {
  const argv = await parser.argv;
  const cli = new CahCli(await createTypeormConnection());
  const command = String(argv._[0]);

  try {
    process.exitCode = await cli.run(command, argv);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

cli().catch(console.error);
