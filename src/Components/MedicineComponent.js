import React, {Component} from 'react';
import styles from '../Styles/components/MedicineComponent';
import {ActivityIndicator, AppRegistry, Image, ImageBackground, Text, TouchableOpacity, View,} from 'react-native';
import PillIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThreeDotsVertical from 'react-native-vector-icons/Entypo';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Config from "react-native-config";
import {NavigationActions, StackActions} from "react-navigation";

export default class MedicineComponent extends Component {
  constructor(props) {
    super(props);
  }
  state={
    nextIndulgment: '',
    lastIndulgment: ''
  };
  daysMapping={
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };


  deleteEntity = async (id) => {
    await fetch(Config.API_HOST + 'medicine/'+id, {
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
  render() {
    return (
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
          <PillIcon name="pill" size={50} color="#00526B"/>
          <Text style={styles.headerText}>
            {this.props.name}
          </Text>

        </View>
        <View style={styles.element}>
          <Text style={styles.elementText}>
            {"count: " + this.props.count}
          </Text>
        </View>
      </View>

    )

  }

}
