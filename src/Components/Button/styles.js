import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 10,
    minWidth: 50,
    minHeight: 40,
  },
  touchable: {
    backgroundColor: 'white',
    borderRadius: 6
  },
  text: {
    color: 'black',
    fontSize: 14
  }
});
