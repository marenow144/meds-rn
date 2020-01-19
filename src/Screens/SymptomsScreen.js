import React, {Component} from 'react';
import {Text, View, ScrollView, SafeAreaView, TouchableOpacity, AsyncStorage} from 'react-native';
import styles from '../Styles/Screens/SymptomScreen';
import SymptomComponent from "../Components/SymptomComponent";
import AddIcon from 'react-native-vector-icons/Ionicons'
import Config from "react-native-config";
import {NavigationActions, StackActions} from "react-navigation";

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
    },
  };

  data = [
    {
      name: 'Shaking',
      lasted: '15',
      occured: ''
    },
    {
      name: 'Shivers',
      lasted: '15',
      occured: ''
    },

  ];

  state = {
    data:[]

  };

  rederSymptomsList = (data) => {
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            {data.map((element) => {
              return (<SymptomComponent
                id={element.id}
                name={element.name}
                description={element.description}
                lasted={element.lasted}
                occured={element.occured}
                shouldParentRerender={()=>{this.getSymptoms()}}
                shouldNavigateToEdit={(data)=>{this.navigateToEdit(data)}}
              />)
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

    )
  };

  getSymptoms= async ()=>{
    try{
      const data = await fetch(Config.API_HOST+'symptom/userId='+ await AsyncStorage.getItem('fcmToken'));
      const responseData = await data.json();
      this.setState({data: responseData});
    }catch (e) {
      console.log("error in fetching: " + e);
    }
  };

  navigateToCreationScreen=()=> {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'SymptomCreationScreen', params:{isEdit: false} })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  navigateToEdit=(data)=>{
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'SymptomCreationScreen', params:{
          id: data.id,
          name: data.name,
          description: data.description,
          lasted: data.lasted,
          occured: data.occured,
          isEdit: true} })],
    });
    this.props.navigation.dispatch(resetAction);
  };


  componentDidMount() {
    this.getSymptoms().then(console.log("this.data= "+ this.state.data))
  }

  render() {
    return (<View style={{flex: 1}}>
      <Text style={styles.headerText}>
        Symptoms
      </Text>
      {this.rederSymptomsList(this.state.data)}
      <TouchableOpacity style={styles.fixedView} onPress={() => {
        this.navigateToCreationScreen()
      }}>
        <View>
          <AddIcon name="md-add-circle" size={80} color="#00526B"/>
        </View>
      </TouchableOpacity>
    </View>)
  }
}
