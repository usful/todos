import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  content: {
    paddingTop: 20,
    height: '80%',
    backgroundColor: 'white',
  },
  textInput: {
    padding: 10,
    width: '100%',
    height: 50,
    backgroundColor: 'white',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingRight: 10,
    paddingLeft: 10,
  },
  usernameTextContainer: {
    justifyContent: 'center',
  },
  usernameText: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  }
});
