import React, {Component} from 'react';
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from '../Styles/Screens/CameraScreen';
import OpenCV from '../NativeModules/OpenCV';
import Toast, {DURATION} from 'react-native-easy-toast'

export default class ImageEnchance extends Component {
  // static navigationOptions = {
  //   header: null
  // };

  state = {
    photo: '',
    deviceDimensions: {
      height: -1,
      width: -1,
    },
    corners: [],
    enchancedFlag: false
  };

  componentWillMount() {
    const {photo, corners, deviceDimensions} = this.props.navigation.state.params;
    this.setState({
      photo, corners, deviceDimensions
    });
  }

  enchanceImage = async (filepath) => {
    return new Promise((resolve, reject) => {
      try {
        return OpenCV.enchanceImage(filepath, this.state.deviceDimensions, this.state.corners, resolve)
      } catch (err) {
        reject(err);
        this.refs.toast.show("Something went wrong during the image enchancement", 500)
      }
    })
  };

  cancelButtonHandler=()=>{
    let RNFS = require('react-native-fs');
    RNFS.unlink(`file://${this.state.photo}`)
      .then(()=>{this.props.navigation.navigate('CameraScreen')})
      .catch((err)=>{
        console.log("error while deleting", err);
      })
  };

  usePhoto=async()=>{
    try {
      const filepath = this.state.photo.split('//')[1];
      const msg = await this.enchanceImage(filepath);
      this.setState({photo: msg, enchancedFlag: true})
    } catch (err){
      console.log(err);
    }
  };

  render() {
    const {width, height} = this.state.deviceDimensions;
    if (this.state.enchancedFlag) {
      return (
        <View style={{
          flex: 1,
          width,
          height,
          alignItems: 'stretch'
        }}>
          <Image
            resizeMode={'contain'}
            source={{uri: `file://${this.state.photo}`}}
            style={{
              flex: 1
            }}
          >
          </Image>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity title={'ok'} onPress={() => this.props.navigation.navigate('MedicineScreen')} style={styles.buttonStyle}>
              <Text style={{color: '#F0F0F0'}}>
                OK
              </Text>
            </TouchableOpacity>
            <TouchableOpacity title={'cancel'} onPress={() => this.cancelButtonHandler()}
                              style={styles.buttonStyle}>
              <Text style={{color: '#F0F0F0'}}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>


        </View>)
    } else {
      this.usePhoto();
      return (
        <View
          style={styles.container}
        >
          <ActivityIndicator size="large" color="#0000ff" styles={{
            alignItems: 'center',
            paddingLeft: this.state.deviceDimensions.width / 2
          }}/>
        </View>
      )

    }


  }

}
