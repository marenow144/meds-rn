import React, {Component} from "react";
import {Animated, PanResponder} from "react-native";
import styles from '../../Styles/DraggableCircle';

export default class DraggableCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      pan: this.createInitialPossitions(this.props.id)
    };


    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset(this.state.pan.__getValue());
      },
      onPanResponderMove: (...rest) => {

        Animated.event([
            null,
            {
              dx: this.state.pan.x,
              dy: this.state.pan.y,

            }
          ],
        )(...rest);
        this.props.onChangePosition({
          x: this.state.pan.x,
          y: this.state.pan.y,
          id: this.state.id,
        })
      },
    });
  }

  createInitialPossitions = (id) => {
        return new Animated.ValueXY({
          x: this.props.corner.x - styles.CIRCLE_RADIUS.width,
          y: this.props.corner.y - styles.CIRCLE_RADIUS.width
        });

  };

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    };
    return (
      <Animated.View
        coordinates={this.state.pan+styles.CIRCLE_RADIUS.width}
        {...this.state.panResponder.panHandlers}
        style={[panStyle, styles.circle]}>
        {this.props.children}
      </Animated.View>
    );
  }
}
