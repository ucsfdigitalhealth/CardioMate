import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";

const StarsDisplay = ({ starCount }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/star_activated.png")}
        style={styles.mainStar}
        resizeMode="contain"
      >
        <Text style={styles.starCountText}>{starCount}</Text>
      </ImageBackground>
      <Image
        source={require("../assets/star_activated_faded.png")}
        style={[styles.smallStar, styles.star1]}
      />
      <Image
        source={require("../assets/star_activated_faded.png")}
        style={[styles.smallStar, styles.star2]}
      />
      <Image
        source={require("../assets/star_activated_faded.png")}
        style={[styles.smallStar, styles.star3]}
      />
      <Image
        source={require("../assets/star_activated_faded.png")}
        style={[styles.smallStar, styles.star4]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainStar: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  starCountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000", // Adjust based on your preference
  },
  smallStar: {
    position: "absolute",
    width: 50,
    height: 50,
    opacity: 0.5,
  },
  star1: { top: -30, left: "10%" },
  star2: { bottom: -30, right: "10%" },
  star3: { top: "10%", left: -10 },
  star4: { top: "10%", right: -10 },
});

export default StarsDisplay;
