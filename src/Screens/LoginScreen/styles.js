
import { StyleSheet, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    backgroundColor: '#e26e64',
    flex: 1
  },
  topContainer: {
    alignItems:'center',
    marginTop: '10%',
    flex: 1
  },
  title: {
    fontSize: 26,
    color: 'white',
  },
  formContainer: {
    paddingLeft: 30,
    paddingBottom: '14%'
  },
  buttons: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
