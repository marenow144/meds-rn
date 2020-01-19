import React, { Component } from 'react';
import ReactNative, { ActivityIndicator, AppRegistry, Image, ImageBackground, Text, TouchableOpacity, View, } from 'react-native';
import { RNCamera as Camera } from 'react-native-camera';
import styles from '../Styles/Screens/CameraScreen';
import draggableCirclesStyles from '../Styles/DraggableCircle';
import OpenCV from '../NativeModules/OpenCV';
import CircleWithinCircle from '../assets/svg/CircleWithinCircle';
import DraggableCircle from '../assets/svg/DraggableCircle';
import Svg from "react-native-svg";
import Polygon from "react-native-svg/elements/Polygon";
import Drawer from "react-native-drawer";
import { withNavigationFocus } from "react-navigation";
export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  };
  state = {
    cameraPermission: false,
    corners: [],
    deviceDimensions: {
      height: -1,
      width: -1,
    },
    photo: {
      isPhotoPreview: false,
      photoPath: '',
      content: ''
    },
  };
  takePicture = async () => {
    if (this.camera) {
      let RNFS = require('react-native-fs');
      const options = {base64: false, skipProcessing: true};
      const cameraResponse = await this.camera.takePictureAsync(options);
      const path = RNFS.DocumentDirectoryPath + "/" + Math.random() + 'capture.jpg';
      try {
        RNFS.writeFile('file://' + path, cameraResponse.uri).then(
          this.setState({
            ...this.state,
            photo: {
              isPhotoPreview: true,
              photoPath: cameraResponse.uri//'file://' + path
            }
          })
        )
      } catch (error) {
        console.log("error in take picture", error);
      }
    }
  };

  renderCirclesAndPolygon = (corners) => {
    if (corners.length === 4) {
      return (
        <View style={styles.container}>
          {corners.map((corner, id) => {
            return (
              <DraggableCircle
                key={id}
                corner={corner}
                id={id}
                onChangePosition={({x, y, id}) => {
                  this.setState((prevState) => {
                    const tempArray = prevState.corners.map((cornerCirclePosition, index) => {
                      let copyCorner = {...cornerCirclePosition};
                      if (id === index) {
                        copyCorner.x = x._offset + x._value + draggableCirclesStyles.CIRCLE_RADIUS.width;
                        copyCorner.y = y._offset + y._value + draggableCirclesStyles.CIRCLE_RADIUS.width;
                      }
                      return copyCorner;
                    });
                    return {
                      corners: tempArray,
                    }

                  });
                }}
              />

            )
          })}
          <Svg height={`${this.state.deviceDimensions.height}`}
               width={`${this.state.deviceDimensions.width}`}>
            <Polygon fill="lime" style={{
              opacity: 0.25,
              position: 'absolute',
              zIndex: 1
            }} points={`
                        ${this.state.corners[0].x},${this.state.corners[0].y},
                        ${this.state.corners[1].x},${this.state.corners[1].y}
                        ${this.state.corners[3].x},${this.state.corners[3].y}
                        ${this.state.corners[2].x},${this.state.corners[2].y}
                        `} stroke="red" strokeWidth="2"/>
          </Svg>
        </View>)
    }
  };
  // onChangePositionHandler=(x,y,id)=>{
  //   this.setState((prevState) => {
  //     const tempArray = prevState.corners.map((cornerCirclePosition, index) => {
  //       let copyCorner = { ...cornerCirclePosition };
  //       if (id === index) {
  //             copyCorner.x = x._offset + x._value+draggableCirclesStyles.CIRCLE_RADIUS.width;
  //             copyCorner.y = y._offset + y._value+draggableCirclesStyles.CIRCLE_RADIUS.width;
  //         }
  //       return copyCorner;
  //     });
  //     return {
  //       corners: tempArray,
  //     }

  //   });
  // }

  initializeCropping = async () => {
    try {
      const filepath = this.state.photo.photoPath.split('//')[1];
      const msg = await this.cropImageOpenCv(filepath);
      this.setState({...this.state, corners: Object.values(msg)});
    } catch (err) {
      console.log('error while cropping', err);
      this.repeatPhoto();
    }
  };
  cropImageOpenCv = async (filepath) => {
    return new Promise((resolve, reject) => {
      try {
        return OpenCV.initializeCropping(filepath, this.state.deviceDimensions, msg => {
          resolve(msg);
        })

      } catch (err) {
        console.log("error", err);
        reject(err);
        this.refs.toast.show("Something went wrong during the image cropping", 500, () => {
          this.repeatPhoto();
        })
      }
    })
  };

  repeatPhoto = () => {
    const filepath = this.state.photo.photoPath.split('//')[1];
    let RNFS = require('react-native-fs');
    RNFS.unlink(filepath)
      .then(() => {
        this.setState({
          ...this.state,
          corners: [],
          deviceDimensions: {
            height: -1,
            width: -1,
          },
          photo: {
            isPhotoPreview: false,
            photoPath: '',
            content: ''
          },
        });
      }).catch((err) => {
      console.log(err)
    });

  };
  usePhoto = () => {
    this.props.navigation.navigate('ImageEnchance', {
      photo: this.state.photo.photoPath,
      deviceDimensions: this.state.deviceDimensions,
      corners: this.state.corners
    })
  };

  componentDidUpdate() {
    if (this.state.corners.length === 0 && this.state.deviceDimensions.height > 0 && this.state.deviceDimensions.width > 0) {
      this.initializeCropping();

    }
  }

  renderCamera() {
    const isFocused = this.props.navigation.isFocused();

    if (!isFocused) {
      return null;
    } else if (isFocused) {
      return (
        <Camera
          captureAudio={false}
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        >
          <View style={styles.takePictureContainer}>
            <TouchableOpacity onPress={this.takePicture}>
              <View>
                <CircleWithinCircle/>
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
      )
    }
  }

    render()
    {
      if (this.state.photo.isPhotoPreview) {
        if (this.state.corners.length === 0) {
          return (
            <View style={styles.container}>
              <ImageBackground key={this.state.photo.photoPath}
                               resizeMode={'stretch'}
                               onLayout={(event) => {
                                 let {x, y, width, height} = event.nativeEvent.layout;
                                 this.setState({
                                   ...this.state,
                                   deviceDimensions: {
                                     height: height,
                                     width: width
                                   }
                                 });
                               }}
                               source={{uri: `${this.state.photo.photoPath}`}}
                               style={styles.imagePreview}><ActivityIndicator size="large"
                                                                              color="#0000ff"/></ImageBackground>
            </View>
          )
        }
        return (
          <View style={styles.container}>
            <Image key={this.state.photo.photoPath}
                   resizeMode={'stretch'}
                   onLayout={(event) => {
                     let {x, y, width, height} = event.nativeEvent.layout;
                     this.setState({
                       ...this.state,
                       deviceDimensions: {
                         height: height,
                         width: width
                       }
                     });
                   }}
                   source={{uri: `${this.state.photo.photoPath}`}}
                   style={styles.imagePreview}
                   resizeMethod={'resize'}
            />
            {this.renderCirclesAndPolygon(this.state.corners)}
            <View style={styles.repeatPhotoContainer}>
              <TouchableOpacity onPress={this.repeatPhoto}>
                <Text style={styles.photoPreviewRepeatPhotoText}>
                  Repeat photo
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.usePhotoContainer}>
              <TouchableOpacity onPress={() => {
                this.usePhoto()
              }
              }>
                <Text style={styles.photoPreviewUsePhotoText}>
                  Use photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          {this.renderCamera()}
        </View>
      );
    }
  }



AppRegistry
  .registerComponent(
    'CameraScreen'
    , () =>
      CameraScreen
  );
