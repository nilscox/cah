// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'flex-start',
  },
  avatar: {
    marginVertical: 20,
    alignSelf: 'center',
  },

  playerInfos: {

  },

  info: {
    flexDirection: 'row',
  },

  label: {
    fontWeight: 'bold',
    marginRight: 10,
    textAlignVertical: 'center',
  },
  valueReadOnly: {
    flex: 1,
  },
  valueReadWrite: {
    flex: 1,
  },

  saveButton: {
    marginVertical: 20,
  },
});
