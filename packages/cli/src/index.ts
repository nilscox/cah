import { CahClient, ServerFetcher } from '@cah/client';
import { Command, Option } from 'commander';
import { inspectGame, inspectPlayer, inspectTurn } from './inspect';

const program = new Command();

program.name('cah');
program.description('CLI client for Cards Against Humanity');
program.configureHelp({ showGlobalOptions: true });
program.showHelpAfterError();

program.addOption(
  new Option('-u --base-url <url>', 'base url of the api server')
    .default('http://localhost:3000')
    .env('BASE_URL'),
);

program.addOption(new Option('-c --cookie <cookie>', 'authentication cookie').env('COOKIE'));

let client: CahClient;
let fetcher: ServerFetcher;

program.hook('preAction', (program) => {
  const { baseUrl, cookie } = program.opts();

  fetcher = new ServerFetcher(baseUrl);
  client = new CahClient(fetcher);

  if (cookie) {
    fetcher.cookie = cookie;
  }
});

program
  .command('info')
  .description('prints information about the current player and its game')
  .action(async () => {
    const player = await client.getAuthenticatedPlayer();
    const game = player.gameId && (await client.getGame(player.gameId));

    console.log(inspectPlayer(player));

    if (game) {
      console.log();
      console.log(inspectGame(game));
    }
  });

program
  .command('get-game <game-id>')
  .description('retrieves a game from its id')
  .action(async (gameId: string) => {
    const game = await client.getGame(gameId);
    const turns = await client.getGameTurns(gameId);

    console.log(inspectGame(game));

    if (turns.length > 0) {
      console.log();
      turns.map((turn) => console.log(inspectTurn(turn)));
    }
  });

program
  .command('get-player')
  .description('retrieves the player currently authenticated')
  .action(async () => {
    console.log(inspectPlayer(await client.getAuthenticatedPlayer()));
  });

program
  .command('authenticate <nick>')
  .description('authenticate as a new or existing player')
  .action(async (nick: string) => {
    await client.authenticate(nick);
    console.log(`export COOKIE=${fetcher.cookie}`);
  });

program
  .command('create-game')
  .description('create a new game of Cards Against Humanity')
  .action(async () => {
    await client.createGame();
  });

program
  .command('join-game <code>')
  .description('join a game from its code')
  .action(async (code: string) => {
    await client.joinGame(code);
  });

program
  .command('start-game')
  .requiredOption('-q --questions <count>', 'total number of questions')
  .description('start the game')
  .action(async ({ questions }: { questions: number }) => {
    await client.startGame(questions);
  });

program
  .command('answer <card...>')
  .description('submit an answer to the current question')
  .action(async (args: string[]) => {
    const indexes = args.map((s) => parseInt(s)).map((n) => n - 1);
    const player = await client.getAuthenticatedPlayer();
    const choices = indexes.map((i) => player.cards?.[i]);

    if (choices.some((choice) => choice === undefined)) {
      throw new Error('invalid input');
    }

    type Choice = Exclude<(typeof choices)[number], undefined>;
    await client.createAnswer(choices as Choice[]);
  });

program
  .command('select-answer <answer>')
  .description('select an answer to be the winner of the current turn')
  .action(async (arg: string) => {
    const index = parseInt(arg) - 1;
    const player = await client.getAuthenticatedPlayer();
    const game = await client.getGame(player.gameId!);
    const answer = 'answers' in game ? game.answers?.[index] : undefined;

    await client.selectAnswer(answer!);
  });

program
  .command('next')
  .description('ends the current turn')
  .action(async () => {
    await client.endTurn();
  });

program.parseAsync().catch(console.error);
