import React, {Component} from 'react';
import {Text, TextInput, View, Alert, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
import MedicineComponent from "../Components/MedicineComponent";
import styles from "../Styles/Screens/MedicineCreationScreen";
import Config from "react-native-config";

export default class MedicineCreationScreen extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    name: '',
    description: '',
    lasted: '',
    occured: '',
    title: 'add new symptom'
  };

  static navigationOptions = {
    title: 'Meds',
    headerStyle: {
      backgroundColor: '#00526B',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };


  componentWillMount(){
    const recievedParams = this.props.navigation.state.params;
    if(recievedParams !== undefined && recievedParams.isEdit){
      this.setState({
        name: recievedParams.name,
        description: recievedParams.description,
        occured: recievedParams.occured,
        lasted: recievedParams.lasted,
        title: 'Edit '+recievedParams.name
      })
    }
  }

  okButtonHandler= async ()=> {
    const userId = await AsyncStorage.getItem("fcmToken");
    if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.isEdit) {
      this.updateHandler(userId);
    } else {
      this.creationHandler(userId);
    }
  };

    creationHandler=async (userId)=>{
      await fetch(Config.API_HOST+'symptom',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "user": userId,
          "name": this.state.name,
          "description": this.state.description,
          "lasted": this.state.lasted,
          "occured": this.state.occured
        })
      }).then((res)=> {
        this.props.navigation.navigate('SymptomsScreen');
      })
    };


    updateHandler=async(userId)=>{
      await fetch(Config.API_HOST+'symptom/'+this.props.navigation.state.params.id,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "user": userId,
          "name": this.state.name,
          "description": this.state.description,
          "lasted": this.state.lasted,
          "occured": this.state.occured
        })
      }).then((res)=> {
        console.log(res);
        this.props.navigation.navigate('SymptomsScreen');
      })
    };



  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
        <Text style={styles.headerText}>
          {this.state.title}
        </Text>
        <TextInput
          placeholder="name"
          value={this.state.name}
          placeholderTextColor={'#00526B'}
          style={styles.nameInput}
          onChangeText={(name) => this.setState({name})}
        />
        <TextInput
          placeholder="description"
          value={this.state.description}
          placeholderTextColor={'#00526B'}
          style={styles.descriptionInput}
          onChangeText={(description) => this.setState({description})}
          multiline
          numberOfLines={4}
        />
        <View style={styles.coupledInputContainer}>
          <View style={styles.leftPartOfCoupledInputContainer}>
            <Text style={{color: '#00526B'}}>
              Lasted (in minutes)
            </Text>
          </View>
          <TextInput style={styles.rightPartOfCoupledInputContainer}
                     keyboardType={'numeric'}
                     value={`${this.state.lasted}`}
                     onChangeText={(lasted)=>{this.setState({lasted})}}
          />
        </View>
        <View style={styles.coupledInputContainer}>
          <View style={styles.leftPartOfCoupledInputContainer}>
            <Text style={{color: '#00526B'}}>
              Occured
            </Text>
          </View>
          <TextInput style={styles.rightPartOfCoupledInputContainer} value={this.state.occured} onChangeText={(occured)=>{this.setState({occured})}}/>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity title={'ok'} onPress={() => this.okButtonHandler()} style={styles.buttonStyle}>
            <Text style={{color: '#F0F0F0'}}>
              OK
            </Text>
          </TouchableOpacity>
          <TouchableOpacity title={'cancel'} onPress={() => this.props.navigation.navigate('SymptomsScreen')}
                            style={styles.buttonStyle}>
            <Text style={{color: '#F0F0F0'}}>
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

}
