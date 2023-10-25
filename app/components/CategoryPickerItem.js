import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";

function CategoryPickerItem({ item, onPress, selected }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        selected && { backgroundColor: colors.primary },
      ]}
    >
      <AppText style={{ color: selected ? colors.black : colors.white }}>
        {item.label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default CategoryPickerItem;
