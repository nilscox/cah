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
  question_text: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    lineHeight: 30,
  },
  question_text_compact: {
    fontSize: 12,
    lineHeight: 20,
  },
  question_blanks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
  },
  fill: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    marginHorizontal: 5,
  },
  blank: {
    width: 40,
    marginHorizontal: 5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
