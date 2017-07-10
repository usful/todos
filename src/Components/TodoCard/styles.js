import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: "white",
    margin: 15,
    marginBottom:0,
    padding:20,
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  cardCheckbox: {
    display:'flex',
    flexDirection:'row',
    marginBottom:10,
  },
  cardActions: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between'
  },
  cardPreview:{
    flex:1,
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around',
  },
  title: {
    fontSize: 18,
  },
});
