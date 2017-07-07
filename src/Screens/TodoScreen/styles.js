import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  container:{
    padding:20,
    paddingTop:35,
    backgroundColor:'#e26e64',
  },
  todo:{
    backgroundColor:'white',
    minHeight:250,
  },
  header: {
    padding:10,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  title:{
    fontSize:22,
    height:24,
  },
  body: {
    marginTop:5,
    padding:10,
  },
  seperator:{
    borderWidth:1,
    borderBottomColor:'grey',
    marginLeft:'auto',
    marginRight:'auto',
    width:'95%',
    opacity:0.3,
  },
  checkboxContainer:{
    display:'flex',
    flexDirection:'row',
  },
  votingButton:{
    display:'flex',
    flexDirection:'row',
    overflow:'hidden',
    padding:10,
    marginTop:10,
    borderRadius:5,
    borderWidth:1,
    borderColor:"#e26e64",
  },
  voted:{
    backgroundColor:"#e26e64",
  },
  notVoted:{
    backgroundColor:"white",
  },
  leftContainer:{
    display:'flex',
    justifyContent:'center',
    width:'50%',

  },
  rightContainer:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:'50%',
  },
  redCircle:{
    backgroundColor:"#e26e64",
    borderColor:"#e26e64",
    borderWidth:1,
    borderRadius: 10,
    width:20,
    height:20,
    padding:2,
    alignItems:'center',
    justifyContent: 'center',
    marginRight:3,
  },
  whiteCircle:{
    backgroundColor:"white",
    borderColor:"white",
    borderWidth:1,
    borderRadius: 10,
    width:20,
    height:20,
    padding:2,
    alignItems:'center',
    justifyContent: 'center',
    marginRight:3,
  }
});