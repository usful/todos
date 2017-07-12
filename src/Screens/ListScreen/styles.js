import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loading: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    fontSize: 24,
    color: '#999',
  },
  buttonContainer: {
    width:"40%",
    alignSelf: 'flex-end',
    marginTop:30,
    padding:10,
  },
  listItem: {
    margin:15,
    marginBottom:0,
  }
});
