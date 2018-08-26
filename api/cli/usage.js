const commands = require('./commands');

module.exports = (commandName, exit) => {
  const option = (name, alias = [], desc) => {
    const key = '  ' + [name, ...alias].join(', ');

    if (key.length > 18)
      return key + '  ' + desc;

    return key.padEnd(20, ' ') + desc;
  };

  const command = (name, desc) => {
    return ('  ' + name).padEnd(20, ' ') + desc;
  };

  const cmd = commands[commandName];

  console.log('usage: cah [options] ' + (cmd ? [commandName, cmd.usage].join(' ') : 'command'));

  if (cmd) {
    console.log();
    console.log(cmd.desc);
  }

  if (!cmd) {
    console.log();
    console.log('global options:');
    console.log(option('--session', ['-s'], 'http session'));
    console.log(option('--help [command]', ['-h'], 'display help'));
    console.log(option('--version', ['-v'], 'output version number'));
    console.log();
    console.log('commands:');
    Object.keys(commands).forEach(c => console.log(command(c, commands[c].desc)));
  } else if (cmd.options) {
    console.log();
    console.log('command options:');
    cmd.options.forEach(({ name, alias, desc }) => console.log(option(name, alias, desc)));
  }

  if (exit !== undefined)
    process.exit(exit);
};
