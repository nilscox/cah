const { log, info } = require('../utils');
const { gameFormatter } = require('../formatters');
const websockets = require('../websockets');

const on_event = async (type, game, ...args) => {
  try {
    websockets.admin(type, { game: await gameFormatter.admin(game) });
    info(type, '#' + game.id, ...args);
  } catch (e) {
    log('EVENT', e);
  }
};

module.exports.on_create = (game, data) => on_event('GAME_CREATE', game, data);
module.exports.on_update = (game, data) => on_event('GAME_UPDATE',game, data);
module.exports.on_delete = (game) => on_event('GAME_DELETE', game);
module.exports.on_join = (game, player) => on_event('GAME_JOIN', game, player.nick);
module.exports.on_leave = (game, player) => on_event('GAME_LEAVE', game, player.nick);
module.exports.on_start = (game) => on_event('GAME_START', game);
module.exports.on_answer = (game, data) => on_event('GAME_ANSWER', game, data);
module.exports.on_select = (game, data) => on_event('GAME_SELECT', game, data);
module.exports.on_next = (game) => on_event('GAME_NEXT', game);
module.exports.on_end = (game) => on_event('GAME_END', game);
