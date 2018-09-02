export const questionLength = (question, choices) => {
  return question.text.length + choices.reduce((a, c) => a + (c ? c.text.length : 10), 0);
};
