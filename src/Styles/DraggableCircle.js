import {StyleSheet} from "react-native";

const CIRCLE_RADIUS = 35;
export default StyleSheet.create({
    //CIRCLE_RADIUS: CIRCLE_RADIUS,
    CIRCLE_RADIUS:{
      width: CIRCLE_RADIUS
    },
    circle: {
        position: 'absolute',
        zIndex: 2,
        backgroundColor: "red",
        opacity: 0.5,
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS,
    }
});
