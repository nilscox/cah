import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 40,
  },
  question: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  question_answer: {

  },
  split_text: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    lineHeight: 30,
  },
  split_fill: {
    fontWeight: 'bold',
    color: '#fff',
  },
  split_blank: {
    width: 40,
    marginHorizontal: 5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
