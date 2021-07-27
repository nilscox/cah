import { Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { Command } from '../Command';

export class Info extends Command {
  printPlayer(player: Player) {
    console.log(`player: `, player.id);
    console.log(`nick: `, player.nick);

    if (player.cards) {
      console.log(`cards:`);

      let n = 1;
      for (const card of player.cards) {
        console.log(`  - [${n++}] ${card.text}`);
      }
    }
  }

  printGame(game: Game) {
    console.log(`game: ${game.id}`);
    console.log(`code: ${game.code}`);
    console.log(`players: ${game.players.map(({ nick }) => nick).join(', ')}`);
    console.log(`state: ${game.state}`);

    if (game.isStarted()) {
      console.log(`play state: ${game.playState}`);
      console.log(`question master: ${game.questionMaster.nick}`);
      console.log(`question: ${game.question.toString()}`);

      console.log(`answers: ${game.answers.length === 0 ? '<empty>' : ''}`);

      for (const answer of game.answers) {
        console.log(`  - [${answer.player.nick}]: ${game.question.toString(answer.choices)}`);
      }

      console.log(`winner: ${game.winner?.nick ?? '<none>'}`);
    }
  }

  async run() {
    if (this.player) {
      this.printPlayer(this.player);
    } else {
      for (const game of await this.deps.gameRepository.findAll()) {
        this.printGame(game);
        console.log();
      }
    }
  }
}
