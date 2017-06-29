import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardContent: {
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  title: {
    width:'40%',
  },
  button: {
    borderColor:"black",
    borderWidth:1,
    padding:2,
  },
  card: {
    backgroundColor: "white",
    margin: 6,
    padding:10,
  }
});
