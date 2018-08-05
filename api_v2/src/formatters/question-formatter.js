const Formatter = require('./formatter');

class QuestionFormatter extends Formatter {

  constructor() {
    super({
      id: q => q.get('id'),
      text: q => q.get('text'),
      blanks: q => q.get('blanks'),
    });
  }

};

module.exports = QuestionFormatter;
