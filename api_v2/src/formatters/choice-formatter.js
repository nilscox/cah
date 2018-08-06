const formatter = require('./formatter');

module.exports = {
  full: formatter({
    id: q => q.get('id'),
    text: q => q.get('text'),
    keepCapitalization: q => q.get('keepCapitalization'),
  }),
};
