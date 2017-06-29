import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardContent: {
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
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
    margin: 6,
    padding:10,
  }
});
