import React, { Component } from 'react';
import styles from '../Styles/components/SymptomComponent';
import { ActivityIndicator, AppRegistry, Image, ImageBackground, Text, TouchableOpacity, View, } from 'react-native';
import BandageIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThreeDotsVertical from 'react-native-vector-icons/Entypo';
import Config from "react-native-config";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
export default class SymptomComponent extends Component{
  constructor(props) {
    super(props);
  }
  deleteEntity = async (id) => {
    await fetch(Config.API_HOST + 'symptom/'+id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(()=>{this.props.shouldParentRerender()});
  };
  handleEdit=()=>{
    this.props.shouldNavigateToEdit(this.props);
  };

  render(){
    return(
      <View style={styles.background}>
        <View style={styles.title}>
          <View style={styles.dots}>
            <Menu>
              <MenuTrigger>
                <ThreeDotsVertical name="dots-three-vertical" size={50} color="#00526B"/>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => alert(this.props.description)} text='View Description'/>
                <MenuOption onSelect={() => {this.handleEdit()}} text={'Edit'}/>
                <MenuOption onSelect={() => this.deleteEntity(this.props.id)}>
                  <Text style={{color: 'red'}}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <BandageIcon name="bandage" size={50} color="#00526B"/>
          <Text style={styles.headerText}>
            {this.props.name}
          </Text>
        </View>
        <View style={styles.element}>
          <Text style={styles.elementText}>
            {"lasted: "+ this.props.lasted}
          </Text>
          <Text style={styles.elementText}>
            {"occured: " + this.props.occured}
          </Text>
        </View>
      </View>

    )

  }

}
