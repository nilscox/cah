const formatter = require('./formatter');

module.exports = {
  full: formatter({
    id: q => q.get('id'),
    text: q => q.get('text'),
    blanks: q => q.get('blanks'),
    nbChoices: q => q.getNbChoices(),
    type: q => q.get('blanks') === null ? 'question' : 'fill',
  }),
};
