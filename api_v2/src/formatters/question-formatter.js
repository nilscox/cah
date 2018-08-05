const formatter = require('./formatter');

module.exports = {
  full: formatter({
    id: q => q.get('id'),
    text: q => q.get('text'),
    blanks: q => q.get('blanks'),
  }),
};
