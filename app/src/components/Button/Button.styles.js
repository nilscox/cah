import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C9C9C9',
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333333',
  },
});

export const variantBig = StyleSheet.create({
  button: {
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 35,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  buttonText: {
    fontSize: 18,
  },
});

export const variantSmall = StyleSheet.create({
  button: {
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 12,
  },
});