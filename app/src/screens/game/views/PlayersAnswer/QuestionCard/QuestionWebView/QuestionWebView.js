// @flow

import * as React from 'react';
import { WebView } from 'react-native';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import CSS from './QuestionWebView.styles.js';

const choice = (choice: Choice): string => {
  let choiceText = choice.text;

  if (!choice.keepCapitalization)
    choiceText = choiceText.charAt(0).toLowerCase() + choiceText.slice(1);

  return `<span class="choice">${choiceText}</span>`;
};

const blank = (): string => '<span class="blank"></span>';

const getHtmlTypeQuestion = (question: Question, nextFill: Function): string => {
  const text = [];

  for (let i = 0; i < question.nb_choices; i++) {
    const fill = nextFill();

    if (fill) {
      fill.keepCapitalization = true;
      text.push(choice(fill));
    }
    else
      text.push(blank());
  }

  return `${question.text}<div class="answers">${text.join('')}</div>`;
}

const getHtmlTypeFill = (question: Question, nextFill: Function): string => {
  const text = [];
  let lastSplit = null;

  for (let i = 0; i < question.split.length; i++) {
    const split = question.split[i];

    if (split)
      text.push(split);
    else {
      const fill = nextFill();

      if (fill) {
        if (i === 0 || (lastSplit && lastSplit.match(/\. */)))
          fill.keepCapitalization = true;

        text.push(choice(fill));
      }
      else
        text.push(blank());
    }

    lastSplit = split;
  }

  return text.join('');
};

const getHtml = (question: Question, nextFill: Function): string => {
  return (question.type === 'question' ? getHtmlTypeQuestion : getHtmlTypeFill)(question, nextFill);
};

type QuestionWebViewProps = {
  compact: boolean,
  question: Question,
  nextFill: Function,
};

const QuestionWebView = ({ compact, question, nextFill }: QuestionWebViewProps) => {
  const css = `<style>${CSS}</style>`;
  const html = `<div class="text${compact ? ' compact' : ''}">${getHtml(question, nextFill)}</div>`;

  return (
    <WebView
      /* eslint-disable-next-line react-native/no-inline-styles */
      style={{ backgroundColor: '#333' }}
      source={{ html: `${css}${html}`, baseUrl: '' }}
    />
  );
};

export default QuestionWebView;
