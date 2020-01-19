import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from "../Styles/Screens/MedicineCreationScreen";
import CallendarIcon from 'react-native-vector-icons/AntDesign'
import ReminderSetupScreen from "../Styles/Screens/ReminderSetupScreen";
import Config from "react-native-config";
import AddRemoveIcons from 'react-native-vector-icons/Ionicons'

export default class MedicineCreationScreen extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    title: 'Add new medicine',
    name: '',
    description: '',
    reminders: [{
      id:0,
      hour:"",
      days:[]
    }],
    count: 0,
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


  componentWillMount() {
    const recievedParams = this.props.navigation.state.params;
    if (recievedParams !== undefined && recievedParams.isEdit) {
      if(recievedParams.reminders !== undefined && recievedParams.reminders.length===0){
        recievedParams.reminders=[{
          id:0,
          hour:"",
          days:[]
        }]
      }

      this.setState({
        name: recievedParams.name,
        description: recievedParams.description,
        reminders: recievedParams.reminders,
        count: recievedParams.count,
        title: 'Edit ' + recievedParams.name
      })
    }
    if('reminderForNavigation' in recievedParams){
      const remindersArray=recievedParams.reminderForNavigation.parentState.reminders;
      remindersArray[recievedParams.reminderForNavigation.id]={
        hour: recievedParams.reminderForNavigation.hour,
        days: recievedParams.reminderForNavigation.days,
      };


      this.setState({
        title: recievedParams.reminderForNavigation.parentState.title,
        name: recievedParams.reminderForNavigation.parentState.name,
        description: recievedParams.reminderForNavigation.parentState.description,
        count: recievedParams.reminderForNavigation.parentState.count,
        reminders: remindersArray
      })

    }
  }


  setReminder = () => {
    let reminder = this.props.navigation.state.params;
    let currentReminders = this.state.reminders;
    currentReminders.push(reminder);
    this.setState({reminders: currentReminders});
  };

  creationHandler = async (userId) => {
    await fetch(Config.API_HOST + 'medicine', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": userId,
        "name": this.state.name,
        "description": this.state.description,
        "reminders": this.state.reminders,
        "count": this.state.count
      })
    }).then((res) => {
      this.props.navigation.navigate('MedicineScreen');
    })
  };


  updateHandler = async (userId) => {
    await fetch(Config.API_HOST + 'medicine/' + this.props.navigation.state.params.id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": userId,
        "name": this.state.name,
        "description": this.state.description,
        "reminders": this.state.reminders,
        "count": this.state.count
      })
    }).then((res) => {
      this.props.navigation.navigate('MedicineScreen');
    })
  };

  okButtonHandler = async () => {
    const userId = await AsyncStorage.getItem("fcmToken");
    if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.isEdit) {
      this.updateHandler(userId);
    } else {
      this.creationHandler(userId);
    }
  };

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (!this.checkIfCurrentlyPresent(nextProps.navigation.state.params)) {
      this.setReminder();
    }
  }

  checkIfCurrentlyPresent = (currentProps) => {
    this.state.reminders.map(e => {
      if (e === currentProps) {
        return true;
      }
    });
    return false;
  };

  renderReminders = () => {
    return (
        <View>
          {this.state.reminders.map((reminder, index) => {
            return(
              <View style={styles.coupledInputContainer}>
                <View style={styles.leftPartOfCoupledInputContainer}>
                  <Text style={{color: '#00526B'}}>
                    Remind at
                  </Text>
                </View>
                <TextInput style={styles.reminderInput} placeholder={reminder.hour}/>
                <TouchableOpacity style={styles.fixedView} setDate={this.setReminder} onPress={() => {
                   this.props.navigation.navigate('ReminderSetupScreen',{creationState: this.state, index: index})
                }}>
                  <CallendarIcon name="calendar" size={35} color="#00526B"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  const obj = {
                    id: this.state.reminders.length+1,
                    hour: "",
                    days:[]
                  };
                  const reminders = this.state.reminders;
                  reminders.push(obj);
                  this.setState({reminders})
                }}>
                  <AddRemoveIcons name="md-add-circle" size={35} color="#00526B"/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  const reminders = [...this.state.reminders];
                  if(reminders.length>1){
                    reminders.splice(index,1);
                    this.setState({reminders});
                  }

                }}>
                  <AddRemoveIcons name="md-remove-circle" size={35} color="#00526B"/>
                </TouchableOpacity>

              </View>
              )
        })}
        </View>)

  };


render()
{
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
      <Text style={styles.headerText}>
        {this.state.title}
      </Text>
      <TextInput
        placeholder="name"
        value={this.state.name}
        style={styles.nameInput}
        placeholderTextColor={'#00526B'}
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
            quantity
          </Text>
        </View>
        <TextInput style={styles.rightPartOfCoupledInputContainer}
                   value={`${this.state.count}`}
                   placeholder={`${this.state.count}`}
                   keyboardType={'numeric'}
                   onChangeText={(count) => {
                     this.setState({count})
                   }}
        />
      </View>
      {this.renderReminders()}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity title={'ok'} onPress={() => this.okButtonHandler()} style={styles.buttonStyle}>
          <Text style={{color: '#F0F0F0'}}>
            OK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity title={'cancel'} onPress={() => this.props.navigation.navigate('MedicineScreen')}
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
