import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  circle: {
    borderWidth: 1,
    borderRadius: 10,
    width: 20,
    height: 20,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notInverted: {
    backgroundColor: '#e26e64',
    borderColor: 'white',
  },
  inverted: {
    backgroundColor: 'white',
    borderColor: '#e26e64',
  },
  text: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  }
});
