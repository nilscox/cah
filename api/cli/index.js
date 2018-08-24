#!/usr/bin/env node

const args = require('node-args');
const player = require('./player');
const game = require('./game');
const format = require('./format');

const COMMANDS = {};

Object.keys(player).forEach(cmd => COMMANDS['player:' + cmd] = player[cmd]);
Object.keys(game).forEach(cmd => COMMANDS['game:' + cmd] = game[cmd]);

const usage = (commandName, exit) => {
  const option = (name, alias = [], desc) => {
    return ('  ' + [name, ...alias].join(', ')).padEnd(20, ' ') + desc;
  };

  const command = (name, desc) => {
    return ('  ' + name).padEnd(20, ' ') + desc;
  };

  const cmd = COMMANDS[commandName];

  console.log('usage: cah [options] ' + (cmd ? [commandName, cmd.usage].join(' ') : 'command'));

  if (cmd) {
    console.log();
    console.log(cmd.desc);
  }

  console.log();
  console.log('options:');
  console.log(option('--session', ['-s'], 'http session'));

  if (!cmd) {
    console.log();
    console.log('commands:');
    Object.keys(COMMANDS).forEach(c => console.log(command(c, COMMANDS[c].desc)));
  } else if (cmd.options) {
    console.log();
    console.log('command options:');
    cmd.options.forEach(({ name, alias, desc }) => console.log(option(name, alias, desc)));
  }

  if (exit)
    process.exit(exit);
};

if (args.help) {
  usage(args.help);
  process.exit(0);
}

if (args.additional.length === 0)
  usage(null, 1);

const command = COMMANDS[args.additional[0]];

if (!command)
  usage(args.additional[0], 1);

args.additional = args.additional.slice(1);

// patch node-args
const lastArg = process.argv[process.argv.length - 1];

if (lastArg.startsWith('--') && !args[lastArg])
  args[lastArg.slice('--'.length)] = true;

if (lastArg.startsWith('-') && !args[lastArg])
  args[lastArg.slice('-'.length)] = true;

(async () => {
  try {
    process.exit(await command.handle(args) || 0);
  } catch (e) {
    try {
      console.log(format.error(e));
    } catch (e) {
      console.log(e);
    }

    process.exit(1);
  }
})();
