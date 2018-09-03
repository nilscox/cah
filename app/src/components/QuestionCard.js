import * as React from 'react';
import { StyleSheet, View, WebView } from 'react-native';


/** QuestionCard
props:
  - style
  - question
  - choices
  - cssStyles
*/

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

const CSS = ({ lineHeight, fontSize, textAlign }) => `
.wrapper {
  width: 100%;
  color: #EEE;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${fontSize || 18};
  line-height: ${lineHeight || 26}px;
  text-align: ${textAlign || 'center'};
}

.blank {
  width: 40px;
  min-height: 15px;
  position: relative;
  top: 2px;
  border-bottom: 1px solid #EEE;
  display: inline-block;
}

.choice {
  font-weight: bold;
  display: inline;
}

.answers {
  margin-top: 15px;
}
`;

const renderHtml = ({ question, choices }) => {
  let html = '';
  let cidx = 0;
  let start = 0;

  const blank = () => '<div class="blank"></div>';
  const choice = (text) => `<div class="choice">${text}</div>`;

  if (question.type === 'question')
    html += question.text + '<div class="answers">';

  for (let i = 0; i < question.nbChoices; ++i) {

    if (question.type === 'fill') {
      const end = question.blanks[i];

      html += question.text.slice(start, end);
      start = end;
    }

    if (choices[cidx++]) {
      const { text, keepCapitalization: kc } = choices[cidx - 1];

      html += choice(kc ? text : text.toLowerCase());
    } else {
      html += blank();
    }
  }

  if (question.type === 'question')
    html += '</div>';
  else if (start < question.text.length)
    html += question.text.slice(start);

  return html;
};

const QuestionCard = ({ style, question, choices, cssStyles }) => {
  const html = `
    <style type="text/css">${CSS(cssStyles || {})}</style>
    <div class="wrapper">
      ${renderHtml({ question, choices })}
    </div>
  `;

  // console.log(html);

  return (
    <View style={[styles.view, style]}>
      <WebView
        style={styles.webview}
        source={{ html, baseUrl: '/' }}
      />
    </View>
  );
};

export default QuestionCard;
