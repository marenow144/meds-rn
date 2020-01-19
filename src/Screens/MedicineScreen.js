import React, {Component} from 'react';
import {Text, View, ScrollView, SafeAreaView, TouchableOpacity, AsyncStorage} from 'react-native';
import styles from '../Styles/Screens/MedicineScreen';
import MedicineComponent from "../Components/MedicineComponent";
import AddIcon from 'react-native-vector-icons/Ionicons'
import Config from 'react-native-config'
import { StackActions, NavigationActions } from 'react-navigation';
import PillIcon from "react-native-vector-icons/MaterialCommunityIcons";
export default class MedicineScreen extends Component {

  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    title: 'Meds',
    headerStyle: {
      backgroundColor: '#00526B',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      fontcolor: '#F0F0F0'
    },
  };

  state = {
    data: [],

  };

  getMedicines= async ()=>{
    const token = await AsyncStorage.getItem('fcmToken');
    if(token!==null){
      try{
        const data = await fetch(Config.API_HOST+'medicine/userId='+ token);

        const responseData = await data.json();
        this.setState({data: responseData});
      }catch (e) {
        console.log("error in fetching: " + e);
      }

    }else {
      console.log("token isnt ready yet")
    }




  };

  componentDidMount(){
      this.getMedicines().then(console.log("this.data= " +this.state.data));
  }

  navigateToCreationScreen=()=> {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'MedicineCreationScreen', params:{isEdit: false} })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  navigateToEdit=(data)=>{
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'MedicineCreationScreen', params:{
          id: data.id,
          name: data.name,
          description: data.description,
          reminders: data.reminders,
          count: data.count,
          isEdit: true} })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  rederMedicineList = (data) => {
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            {data.map((element)=>{
              return (<MedicineComponent
                id={element.id}
                name={element.name}
                count={element.count}
                reminders={element.reminders}
                description={element.description}
                shouldParentRerender={()=>{this.getMedicines()}}
                shouldNavigateToEdit={(data)=>{this.navigateToEdit(data)}}
              />)
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  };
  render() {
    return (<View style={{flex: 1}}>
      <Text style={styles.headerText}>
        Medicines
      </Text>
      {this.rederMedicineList(this.state.data)}
      <TouchableOpacity style={styles.fixedView} onPress={()=>{this.navigateToCreationScreen()}}>
        <View>
          <AddIcon name="md-add-circle" size={80} color="#00526B"/>
        </View>
      </TouchableOpacity>
    </View>)
  }
}
