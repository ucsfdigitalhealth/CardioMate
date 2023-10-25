import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Linking,
  Text,
  View,
  ScrollView,
} from "react-native";
import AppButton from "../components/AppButton";
import LottieView from "lottie-react-native";
import authStorage from "../auth/storage";
import endpointURL from "../api/serverPoint";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import useAuth from "../auth/useAuth";
import StarsDisplay from "../components/StarsDisplay";

function StarsScreen(props) {
  const [userData, setUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filteredUserData, setFilteredUserData] = useState([]);

  const getUsers = async () => {
    try {
      const token = await authStorage.getToken();
      const response = await fetch(endpointURL + "/users", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setUserData(json);
      const userDataArray = json.filter((item) => item.id === user.userId);
      setFilteredUserData(userDataArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const { user } = useAuth();

  //console.log(userData);

  return (
    <Screen style={styles.container}>
      <ScrollView>
        {isLoading || userData.length === 0 ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif.gif")}
          />
        ) : userData ? (
          <>
            <AppText style={styles.heading}>🌟 Stars Recieved!</AppText>
            <View style={styles.star}>
              <StarsDisplay starCount={filteredUserData[0].badge.toString()} />
            </View>
            <AppText style={styles.explanation}>
              🌟 Why Collect Stars? Stars aren't just for show! Accumulating
              stars can unlock special rewards, bonuses, and exclusive content
              tailored just for you. Plus, they represent your progress and
              dedication.
            </AppText>
            <Image
              style={styles.congrats}
              source={require("../assets/congrats.png")}
            />
          </>
        ) : (
          <>
            <Image
              style={styles.logo}
              source={require("../assets/starspage.png")}
            />
            <AppText style={styles.explanation}>
              🌟 What are the Stars? Here, you'll track the stars you earn
              throughout your journey with us. Stars are a token of recognition
              for your achievements, activities, and milestones.
            </AppText>
            <AppText style={styles.explanation}>
              🌟 How Can I Earn Stars? Engage with our platform, complete
              challenges, participate in events, and watch out for special
              opportunities to gather stars. The more involved you are, the more
              stars you'll earn!
            </AppText>
            <AppText style={styles.explanation}>
              🌟 Why Collect Stars? Stars aren't just for show! Accumulating
              stars can unlock special rewards, bonuses, and exclusive content
              tailored just for you. Plus, they represent your progress and
              dedication.
            </AppText>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
  },
  fitbit: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    width: 350,
    height: 350,
  },
  check: {
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 40,
    borderRadius: 20,
    width: 85,
    height: 85,
  },
  explanation: {
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    textAlign: "justify",
  },
  heading: {
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  loading: {
    alignSelf: "center",
  },
  star: {
    marginVertical: 50,
  },
  congrats: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default StarsScreen;
