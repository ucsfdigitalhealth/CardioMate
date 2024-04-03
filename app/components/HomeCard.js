import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";

import AppText from "./AppText";

function HomeCard({ title, subTitle, imageUrl, onPress }) {
  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2.2; // Assuming you have 2 columns
  const cardWidth = screenWidth / numColumns;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, { width: cardWidth }]}>
        <Image style={styles.image} source={imageUrl} />
        <View style={styles.detailsContainer}>
          <AppText style={styles.title}>{title}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.secondary,
    marginTop: 7,
    marginBottom: 7,
    overflow: "hidden",
    //width: "50%", // Set the card width to 48% to fit two columns on the screen
  },
  image: {
    width: "100%",
    height: 100,
  },
  detailsContainer: {
    padding: 10,
    color: colors.white,
  },
  title: {
    marginBottom: 7,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.white,
  },
  subTitle: {
    fontSize: 15,
    color: colors.white,
    textAlign: "center",
  },
});

export default HomeCard;
