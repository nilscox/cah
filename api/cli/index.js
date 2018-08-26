#!/usr/bin/env node

const args = require('node-args');
const pkg = require('../package');
const usage = require('./usage');
const format = require('./format');
const commands = require('./commands');

// patch node-args
const lastArg = process.argv[process.argv.length - 1];

if (lastArg.startsWith('--') && !args[lastArg])
  args[lastArg.slice('--'.length)] = true;

if (lastArg.startsWith('-') && !args[lastArg])
  args[lastArg.slice('-'.length)] = true;

args.h = args.h || args.help;
args.v = args.v || args.version;

if (args.help) {
  usage(args.help);
  process.exit(0);
}

if (args.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (args.additional.length === 0)
  usage(null, 1);

const command = commands[args.additional[0]];

if (!command)
  usage(args.additional[0], 1);

args.additional = args.additional.slice(1);

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
