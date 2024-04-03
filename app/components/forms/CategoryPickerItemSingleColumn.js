import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import AppText from "../AppText";
import colors from "../../config/colors";
import fonts from "../../config/fonts";

function CategoryPickerItemSingleColumn({ item, onPress, selected }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        selected && { backgroundColor: colors.secondary },
      ]}
    >
      <Image style={styles.fruitLogo} source={item.icon} />
      <AppText
        style={{
          color: selected ? colors.blue : colors.white,
          fontFamily: fonts.fifthSemiBoldItalic,
        }}
      >
        {item.label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginVertical: 10,
  },
  fruitLogo: {
    alignSelf: "center",
    height: 80,
    aspectRatio: 1,
    // borderRadius: 30,
    // overlayColor: colors.bgcolor,
    // overflow: "hidden",
    // marginVertical: 15,
  },
});

export default CategoryPickerItemSingleColumn;
