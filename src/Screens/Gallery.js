import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Image, Text
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import ThreeDotsVertical from "react-native-vector-icons/Entypo";



export default class Gallery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
    };
  }

  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }

  componentDidMount() {
    var that = this;
    let RNFS = require('react-native-fs');
    let res=[];
    let items=[];

    let dir="";
    if(Platform.OS==='ios'){
      dir = RNFS.DocumentDirectoryPath;
    }else {
      dir = "/storage/emulated/0/react-native-scans/"
    }
    RNFS.readDir(dir)
      .then((result) => {
        res=result;
        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((contents) => {
        items.length = 0;
        res.map((v,i)=>{

         items.push({id: i, src: "file://"+res[i].path})
        });
        that.setState({
          dataSource: items,
        });
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });



  }

  render() {
    if (this.state.ModalVisibleStatus) {
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
          }}>
          <View style={styles.modelStyle}>
            <Image
              style={styles.fullImageStyle}
              source={{ uri: this.state.imageuri }}
              // resizeMode={FastImage.resizeMode.contain}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
              }}>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                <TouchableOpacity
                  key={item.id}
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.ShowModalFunction(true, item.src);
                  }}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.src,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  image: {
    height: 120,
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
});

