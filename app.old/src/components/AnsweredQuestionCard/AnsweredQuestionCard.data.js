export const questions = {
  questionShort: {
    id: 42,
    type: 'question',
    text: 'C\'est quoi ce bruit ?',
    split: ['C\'est quoi ce bruit ?'],
    nb_choices: 1,
  },
  questionLong: {
    id: 42,
    type: 'question',
    text: 'Que vais-je ramener du futur pour convaincre les gens que je suis un puissant sorcier ?',
    split: ['Que vais-je ramener du futur pour convaincre les gens que je suis un puissant sorcier ?'],
    nb_choices: 1,
  },
  fillShort: {
    id: 42,
    type: 'fill',
    text: 'Au paradis, il y a une tonne de .',
    split: ['Au paradis, il y a une tonne de ', null, '.'],
    nb_choices: 1,
  },
  fillLong: {
    id: 42,
    type: 'fill',
    text: 'Avant , tout ce que nous avions était . Un tribunal international a condamné  coupable de .',
    split: ['Avant ', null, ', tout ce que nous avions était ', null, '. Un tribunal international a condamné ', null, ' coupable de ', null, '.'],
    nb_choices: 4,
  },
};

export const answers = {
  answer1: {
    id: 42,
    text: 'Pastèque',
  },
  answer2: {
    id: 42,
    text: 'La fête du slip',
  },
  answer3: {
    id: 69,
    text: 'Du soleil et un arc-en-ciel',
  },
  answer4: {
    id: 69,
    text: 'Nadine Morano',
  },
};
