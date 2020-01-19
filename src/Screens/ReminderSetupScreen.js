import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import styles from "../Styles/Screens/ReminderSetupScreen";
import DatePicker from 'react-native-datepicker'
import {NavigationActions, StackActions} from "react-navigation";


export default class MedicineScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hour: '',
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      }
    }
  }

  componentWillMount() {
   // const date = new Date().getDate();
    const navigationObject = this.props.navigation.state.params.creationState.reminders[this.props.navigation.state.params.index];

    if (navigationObject.days.length!==0) {
      let daysObject= {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
      navigationObject.days.forEach((day) => {

        daysObject[day] = true;
      });

      this.setState({
        days: daysObject,
        hour: this.props.navigation.state.params.hour,
      });

    }
  }

  changeDayStatus = (day) => {
    let prop = {...this.state};
    prop.days[day] = !prop.days[day];
    this.setState({prop});
  };

  okClickHandler = () => {
    const days = [];
    Object.keys(this.state.days).forEach((day) => {
      if (this.state.days[day] === true) {
        days.push(day);
      }
    });
    const reminderForNavigation = {
      parentState: this.props.navigation.state.params.creationState,
      id: this.props.navigation.state.params.index,
      hour: this.state.hour,
      days
    };
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'MedicineCreationScreen', params: {reminderForNavigation}})],
    });
    this.props.navigation.dispatch(resetAction);
  };


  render() {
    return (
      <View>
        <Text style={styles.headerText}>
          Setup a reminder
        </Text>
        <View>
          <CheckBox checked={this.state.days.monday} onPress={() => this.changeDayStatus("monday")} title="monday"/>
          <CheckBox checked={this.state.days.tuesday} onPress={() => this.changeDayStatus("tuesday")} title="tuesday"/>
          <CheckBox checked={this.state.days.wednesday} onPress={() => this.changeDayStatus("wednesday")}
                    title="wednesday"/>
          <CheckBox checked={this.state.days.thursday} onPress={() => this.changeDayStatus("thursday")}
                    title="thursday"/>
          <CheckBox checked={this.state.days.friday} onPress={() => this.changeDayStatus("friday")} title="friday"/>
          <CheckBox checked={this.state.days.saturday} onPress={() => this.changeDayStatus("saturday")}
                    title="saturday"/>
          <CheckBox checked={this.state.days.sunday} onPress={() => this.changeDayStatus("sunday")} title="sunday"/>
        </View>
        <DatePicker
          style={{width: 200, color: '#00526B'}}
          date={this.state.hour}
          mode="time"
          placeholder={this.state.hour}
          format="HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'relative',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(hour) => {
            this.setState({hour})
          }}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity title={'ok'} onPress={() => this.okClickHandler()}
                            style={styles.buttonStyle}>
            <Text style={{color: '#F0F0F0'}}>
              OK
            </Text>
          </TouchableOpacity>
          <TouchableOpacity title={'cancel'} onPress={() => this.props.navigation.navigate('MedicineCreationScreen')}
                            style={styles.buttonStyle}>
            <Text style={{color: '#F0F0F0'}}>
              CANCEL
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}
