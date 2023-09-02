import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
//import Icon from "./Icon";
import AppText from "./AppText";
import colors from "../config/colors";

function CategoryPickerItemColumn({ item, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        {/* <Icon
          backgroundColor={item.backgroundColor}
          name={item.icon}
          size={120}
        /> */}
        <Image style={styles.fruitLogo} source={item.icon} />
        <AppText style={styles.label}>{item.label}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: "center",
    width: "50%",
  },
  label: {
    marginTop: 5,
    color: "white",
    textAlign: "center",
  },
  fruitLogo: {
    width: "100%",
    height: 150,
    aspectRatio: 1,
    borderRadius: 30,
    overlayColor: colors.bgcolor,
    overflow: "hidden",
    marginVertical: 15,
  },
});

export default CategoryPickerItemColumn;
