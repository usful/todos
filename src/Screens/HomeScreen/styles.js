import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  menu: {
    height: 56,
    backgroundColor: "#E26E64",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
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
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  }
});
