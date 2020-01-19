import React from 'react';
import CameraScreen from './src/Screens/CameraScreen';
import ImageEnchance from './src/Screens/ImageEnchance';
import {
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import MedicineScreen from "./src/Screens/MedicineScreen";
import MedicineCreationScreen from "./src/Screens/MedicineCreationScreen";
import SymptomCreationScreen from "./src/Screens/SymptomCreationScreen";
import SymptomsScreen from "./src/Screens/SymptomsScreen";
import ReminderSetupScreen from "./src/Screens/ReminderSetupScreen";
import MedicineComponent from "./src/Components/MedicineComponent";
import {AsyncStorage, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import Config from "react-native-config";
import { MenuProvider } from 'react-native-popup-menu';
import Gallery from "./src/Screens/Gallery";

const RootStack = createStackNavigator(
  {
    MedicineScreen,
    CameraScreen,
    ImageEnchance,
    ReminderSetupScreen,
    MedicineComponent,
    MedicineCreationScreen,
    SymptomsScreen,
    SymptomCreationScreen,
    Gallery
  },
  {
    //initialRouteName: 'CameraScreen',
    //initialRouteName: 'MedicineScreen',
    //headerMode: 'none'

  },
);
//ENABLES NAVIGATOR
const navigator = createDrawerNavigator({
    MedicineScreen: {
      screen: RootStack
    },
    CameraScreen: {
      screen: RootStack
    },
    SymptomsScreen: {
      screen: RootStack
    },
    Gallery: {
      screen: Gallery
    }
    // MedicineScreen: {
    //   screen: MedicineScreen
    // },
    //
    // CameraScreen: {
    //   screen: CameraScreen
    // },

  },
  {

    drawerType: 'slide'
  }
);
const AppContainer = createAppContainer(navigator);

export default class Meds extends React.Component {


  notificationListener;

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  //1
  async checkPermission() {
    console.log("waiting for permissions");
    const enabled = await firebase.messaging().hasPermission();
    console.log("enabled", enabled);
    if (enabled) {
      console.log("permissions available");
      this.getToken();
    } else {
      console.log("no permissions");
      this.requestPermission();

    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        const response = await fetch(Config.API_HOST+'user',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "deviceId": fcmToken
          })
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log("responseJson", responseJson);
            return responseJson;
          });
        console.log("response", response);


      }
    }
  }

////////////////////// Add these methods //////////////////////

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    console.log("creating listener");
    /*
    * Triggered when a particular notification has been received in foreground
    * */

    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log("notification recived");
      const {title, body} = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const {title, body} = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }


  render() {
    return <MenuProvider><AppContainer/></MenuProvider>;
  }
}
