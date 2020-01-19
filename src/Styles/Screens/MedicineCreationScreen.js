import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({

  container: {
    flex: 1
  },
  headerText: {
    fontSize: 40,
    textAlign: 'center',
    color:'#00526B',
    borderBottomWidth: 2,
    borderBottomColor: 'black',

  },
  nameInput: {
    color: '#00526B',
    width: 297,
    height: 35,
    marginTop: 25,
    marginLeft: 39,
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    textAlign: 'center',
  },
  descriptionInput: {
    color: '#00526B',
    width: 297,
    height: 122,
    borderRadius: 30,
    marginTop: 25,
    marginLeft: 39,
    backgroundColor: '#F0F0F0',
    textAlign: 'center'

  },
  coupledInputContainer: {
    flex:1,
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 47,
  },
  leftPartOfCoupledInputContainer: {
    width: 140,
    height: 35,
    backgroundColor: "#F0F0F0",
    borderTopLeftRadius: 100,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 100,

    justifyContent: 'center',
    alignItems: 'center'
  },
  reminderInput: {

    width: 50,
    height: 35,
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    borderWidth: 1,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    marginLeft: 1,
  },


  rightPartOfCoupledInputContainer: {
    color: '#00526B',
    width: 100,
    height: 35,
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    borderWidth: 1,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    marginLeft: 1,
  },
  buttonsContainer: {
    flex:1,
    flexDirection: 'row',
    marginTop: 25,

  },
  buttonStyle: {
    width: 140,
    height: 30,
    backgroundColor: "#00526B",
    borderRadius: 5,
    borderColor: "#000000",
    borderWidth: 0,
    marginLeft: 25,
    justifyContent: 'center',
    alignItems: 'center',

  }

})
