/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf, addDecorator } from '@storybook/react-native';
import { withKnobs, select } from '@storybook/addon-knobs';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import EndOfTurn from './EndOfTurn';

const state = {
  status: {
    app: 'ready',
    api: 'up',
    websocket: 'open'
  },
  games: [
    {
      id: 1,
      lang: 'fr',
      owner: 'Jeanne',
      players: [
        {
          nick: 'Tom',
          connected: true,
          avatar: null,
          score: 0
        },
        {
          nick: 'Jeanne',
          connected: false,
          avatar: null,
          score: 0
        },
        {
          nick: 'Nils',
          connected: true,
          avatar: null,
          score: 1
        }
      ],
      state: 'started'
    }
  ],
  player: {
    nick: 'Nils',
    connected: true,
    avatar: null,
    score: 1,
    cards: [
      {
        id: 6,
        text: 'La couverture médiatique',
        keepCapitalization: false
      },
      {
        id: 134,
        text: 'Les vikings',
        keepCapitalization: false
      },
      {
        id: 221,
        text: 'Europe Ecologie',
        keepCapitalization: false
      },
      {
        id: 139,
        text: 'Une attaque au gaz sarin',
        keepCapitalization: false
      },
      {
        id: 268,
        text: 'Des oeufs de ptérodactyle',
        keepCapitalization: false
      },
      {
        id: 300,
        text: 'Le velcro',
        keepCapitalization: false
      },
      {
        id: 368,
        text: 'Un râle de satisfaction',
        keepCapitalization: false
      },
      {
        id: 413,
        text: 'Les hémorroïdes',
        keepCapitalization: false
      },
      {
        id: 588,
        text: 'Idolâtrer son papa',
        keepCapitalization: false
      },
      {
        id: 658,
        text: 'Robert Downey Junior',
        keepCapitalization: true
      }
    ],
    game: 1,
    submitted: {
      id: 1,
      question: {
        id: 24,
        type: 'fill',
        text: 'Dans ses derniers moments, Michael Jackson a pensé à ... .',
        split: [
          'Dans ses derniers moments, Michael Jackson a pensé à ',
          null,
          '.'
        ],
        nb_choices: 1
      },
      text: 'Dans ses derniers moments, Michael Jackson a pensé à Michael Jackson .',
      split: [
        'Dans ses derniers moments, Michael Jackson a pensé à',
        'Michael Jackson',
        '.'
      ],
      answers: [
        {
          id: 352,
          text: 'Michael Jackson',
          keepCapitalization: true
        }
      ],
      answered_by: 'Nils',
      selected_by: 'Tom'
    },
    selectedChoices: []
  },
  game: {
    id: 1,
    lang: 'fr',
    state: 'started',
    play_state: 'end_of_turn',
    owner: 'Jeanne',
    players: [
      {
        nick: 'Tom',
        connected: true,
        avatar: null,
        score: 0
      },
      {
        nick: 'Jeanne',
        connected: false,
        avatar: null,
        score: 0
      },
      {
        nick: 'Nils',
        connected: true,
        avatar: null,
        score: 1
      }
    ],
    question_master: 'Tom',
    question: {
      id: 24,
      type: 'fill',
      text: 'Dans ses derniers moments, Michael Jackson a pensé à ... .',
      split: [
        'Dans ses derniers moments, Michael Jackson a pensé à ',
        null,
        '.'
      ],
      nb_choices: 1
    },
    propositions: [
      {
        id: 2,
        question: {
          id: 24,
          type: 'fill',
          text: 'Dans ses derniers moments, Michael Jackson a pensé à ... .',
          split: [
            'Dans ses derniers moments, Michael Jackson a pensé à ',
            null,
            '.'
          ],
          nb_choices: 1
        },
        text: 'Dans ses derniers moments, Michael Jackson a pensé à Le pays du chocolat .',
        split: [
          'Dans ses derniers moments, Michael Jackson a pensé à',
          'Le pays du chocolat',
          '.'
        ],
        answers: [
          {
            id: 206,
            text: 'Le pays du chocolat',
            keepCapitalization: false
          }
        ]
      },
      {
        id: 1,
        question: {
          id: 24,
          type: 'fill',
          text: 'Dans ses derniers moments, Michael Jackson a pensé à ... .',
          split: [
            'Dans ses derniers moments, Michael Jackson a pensé à ',
            null,
            '.'
          ],
          nb_choices: 1
        },
        text: 'Dans ses derniers moments, Michael Jackson a pensé à Michael Jackson .',
        split: [
          'Dans ses derniers moments, Michael Jackson a pensé à',
          'Michael Jackson',
          '.'
        ],
        answers: [
          {
            id: 352,
            text: 'Michael Jackson',
            keepCapitalization: true
          }
        ]
      }
    ],
    history: [
      {
        number: 1,
        question_master: 'Tom',
        winner: 'Nils',
        question: {
          id: 24,
          type: 'fill',
          text: 'Dans ses derniers moments, Michael Jackson a pensé à ... .',
          split: [
            'Dans ses derniers moments, Michael Jackson a pensé à ',
            null,
            '.'
          ],
          nb_choices: 1
        },
        answers: [
          {
            id: 2,
            text: 'Dans ses derniers moments, Michael Jackson a pensé à Le pays du chocolat .',
            split: [
              'Dans ses derniers moments, Michael Jackson a pensé à',
              'Le pays du chocolat',
              '.'
            ],
            answers: [
              {
                id: 206,
                text: 'Le pays du chocolat',
                keepCapitalization: false
              }
            ],
            answered_by: 'Jeanne'
          },
          {
            id: 1,
            text: 'Dans ses derniers moments, Michael Jackson a pensé à Michael Jackson .',
            split: [
              'Dans ses derniers moments, Michael Jackson a pensé à',
              'Michael Jackson',
              '.'
            ],
            answers: [
              {
                id: 352,
                text: 'Michael Jackson',
                keepCapitalization: true
              }
            ],
            answered_by: 'Nils'
          }
        ]
      }
    ]
  }
};

const store = createStore(a => a, state);

addDecorator(withKnobs);
addDecorator((story) => <Provider store={store}>{story()}</Provider>);

storiesOf('EndOfTurn', module)
  .add('End of turn', () => <EndOfTurn />);
