import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardContent: {
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    minHeight:40,
  },
  titleContainer: {
    width:'60%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },
  title: {
    fontSize: 18,
  },
  card: {
    backgroundColor: "white",
    margin: 15,
    marginBottom:0,
    padding:10,
  },
});
