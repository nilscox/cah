import * as React from 'react';
import { StyleSheet, View, WebView } from 'react-native';

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#333',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

const CSS = ({ textAlign }) => `
.wrapper {
  width: 100%;
  color: #CCC;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 25px;
  text-align: ${textAlign || 'center'};
}

.blank {
  width: 40px;
  min-height: 15px;
  position: relative;
  top: 2px;
  border-bottom: 1px solid #CCC;
  display: inline-block;
}

.choice {
  font-weight: bold;
  display: inline-block;
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

  return html;
}

export default class QuestionCard extends React.Component {

  constructor(props) {
    super(props);

    this.viewRef = null;
  }

  componentDidUpdate() {
    if (this.viewRef)
      this.viewRef.reload();
  }

  render() {
    const { style, question, choices, textAlign } = this.props;

    const html = `
      <style type="text/css">${CSS({ textAlign })}</style>
      <div class="wrapper">
        ${renderHtml({ question, choices })}
      </div>
    `;

    // console.log(html);
    return (
      <View style={[styles.view, style]}>
        <WebView
          ref={ref => view = this.viewRef}
          style={styles.webview}
          source={{ html, baseUrl: '/' }}
        />
      </View>
    );
  }

}
