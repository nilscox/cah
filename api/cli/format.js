const { CLIError, CLIRequestError } = require('./error');

const padded = (k, v) => (k + ':').padEnd(16, ' ') + v;

const line = (...args) => {
  return args.join(' ') + '\n';
};

const enumerate = (arr, f) => {
  return arr.map((c, i) => {
    return ('  ' + (i + 1) + '.').padEnd(6, ' ') + f(c, i);
  }).join('\n');
};

const question = (q, a) => {
  if (q.type === 'question') {
    return a
      ? a.choices.map(c => c.text || '___')
      : [q.text, Array(q.nbChoices).fill('___')].join(' ');
  }

  let res = '';
  let start = 0;
  let cidx = 0;

  q.blanks.forEach(end => {
    if (end > 0)
      res += q.text.slice(start, end);

    start = end;

    if (a && a.choices[cidx++])
      res += a.choices[cidx - 1].text;
    else
      res += '___';
  });

  if (start < q.text.length)
    res += q.text.slice(start);

  return res;
};

module.exports.player = (p, opts) => {
  let res = '';

  res += line('-- player: ' + p.nick + ' --');
  res += line();
  res += line(padded('nick', p.nick));
  res += line(padded('avatar', p.avatar));
  res += line(padded('connected', p.connected));

  if (p.cards) {
    res += line();
    res += line('cards:');
    res += line(enumerate(p.cards, c => c.text));
  }

  return res;
};

module.exports.game = g => {
  let res = '';

  const isWinner = a => g.selectedAnswer && a.id === g.selectedAnswer.id;

  res += line('-- game: ' + g.id + ' --');
  res += line();
  res += line(padded('id', g.id));
  res += line(padded('owner', g.owner));
  res += line(padded('lang', g.lang));
  res += line(padded('nb questions', g.nbQuestions));
  res += line(padded('cards / player', g.cardsPerPlayer));
  res += line(padded('state', g.state));

  if (g.playState)
    res += line(padded('play state', g.playState));

  if (g.selectedAnswer)
    res += line(padded('winner', g.selectedAnswer.answeredBy));

  res += line();
  res += line('players:');
  res += line(enumerate(g.players, p => p.nick));

  if (g.state === 'started') {
    res += line();
    res += line(padded('QM', g.questionMaster));
    res += line(padded('question', question(g.question)));

    if (g.propositions) {
      res += line()
      res += line('propositions:')
      res += line(enumerate(g.propositions, p => {
        return question(g.question, p) + (isWinner(p) ? ' (winner)' : '');
      }));
    }
  }

  return res;
};

module.exports.error = e => {
  if (!(e instanceof CLIError))
    throw e;

  let res = '';

  if (e instanceof CLIRequestError) {
    res += line('-- request error --');
    res += line();
    res += line(padded('method', e.method));
    res += line(padded('route', e.route));
    res += line(padded('status', e.status));
    res += line();
    res += line('body:');
    res += JSON.stringify(e.body, 2, 2);
  } else {
    res += line('-- cli error --');
    res += line();
    res += e.toString();
  }

  return res;
};
