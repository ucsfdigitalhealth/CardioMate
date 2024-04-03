import React from "react";
import Constants from "expo-constants";
import { SafeAreaView, StyleSheet, Platform, View } from "react-native";
import colors from "../config/colors";

function AdminScreen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.screenview, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
    //paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: colors.bgcolor,
    paddingBottom: 76,
  },
  screenview: {
    backgroundColor: colors.bgcolor,
  },
});

export default AdminScreen;
