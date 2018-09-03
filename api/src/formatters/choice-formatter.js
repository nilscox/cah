const formatter = require('./formatter');

module.exports = {
  full: formatter({
    id: c => c.get('id'),
    text: c => c.get('text'),
    keepCapitalization: c => c.get('keepCapitalization'),
  }),
};
