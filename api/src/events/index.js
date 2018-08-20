const EventEmitter = require('events');

const player = require('./player-events');
const game = require('./game-events');

class CAHEvents extends EventEmitter {}

const events = module.exports = new CAHEvents();

events.on('player create', player.on_create);
events.on('player update', player.on_update);
events.on('player delete', player.on_delete);

events.on('player login', player.on_login);
events.on('player logout', player.on_logout);

events.on('player connect', player.on_connect);
events.on('player disconnect', player.on_disconnect);

events.on('game create', game.on_create);
events.on('game update', game.on_update);
events.on('game delete', game.on_delete);

events.on('game join', game.on_join);
events.on('game leave', game.on_leave);

events.on('game start', game.on_start);
events.on('game answer', game.on_answer);
events.on('game select', game.on_select);
events.on('game next', game.on_next);
