import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";
import fonts from "../config/fonts";

function ListItem2({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  titleStyle,
}) {
  return (
    <TouchableHighlight underlayColor={colors.lightGray} onPress={onPress}>
      <View style={styles.container}>
        {IconComponent}
        {image && <Image style={styles.image} source={image} />}
        <View style={styles.detailsContainer}>
          <AppText style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </AppText>
          {subTitle && (
            <AppText style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </AppText>
          )}
        </View>
        <MaterialCommunityIcons
          color={colors.medium}
          name="chevron-right"
          size={25}
        />
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.primary,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    color: colors.darkGray,
    fontFamily: fonts.fifthBoldItalic,
  },
  subTitle: {
    color: colors.medium,
    color: colors.darkGray,
    fontFamily: fonts.thirdBoldItalic,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
});

export default ListItem2;
