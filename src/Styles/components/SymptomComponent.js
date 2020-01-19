import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  background: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingLeft: 50,
    backgroundColor:'#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 3,


  },
  title: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: -50
  },
  elements: {
    fontSize: 35,
  },
  elementText: {
    fontSize: 20,
  },
  headerText: {
    fontSize: 40,
    color:'#00526B'
  },
  dots: {
    paddingTop: 4,
    zIndex: 2
  }


})
