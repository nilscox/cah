export const questionLength = (question, choices) => {
  return question.text.length + choices.reduce((a, c) => a + c.text.length, 0);
};
