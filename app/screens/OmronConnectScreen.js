import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Linking,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import useAuth from "../auth/useAuth";
import fonts from "../config/fonts";

function OmronConnectScreen({ navigation }, props) {
  const [userData, setUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const getOmronHgUsers = async () => {
    try {
      const token = await authStorage.getToken();
      const response = await fetch(endpointURL + "/registeredomronhg", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      const isUserIdInArray = json.user_ids.includes(user.userId.toString());
      setUserData(isUserIdInArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    (isFocused) => {
      getOmronHgUsers();
    },
    [isFocused]
  );

  const { user } = useAuth();

  //console.log(userData);

  return (
    <Screen style={styles.mycontainer}>
      {isLoading || userData.length === 0 ? (
        <Image
          style={styles.loading}
          source={require("../assets/animations/loading_gif.gif")}
        />
      ) : userData ? (
        <>
          <View style={styles.mycontainer}>
            <Image
              source={require("../assets/check.png")} // Replace with your success image path
              style={styles.image}
            />
            <Text style={styles.title}>Omron HG Device Registered!</Text>
            <Text style={styles.description}>
              Your Omron HG device has been successfully registered with our
              server.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.ACCOUNT)} // Replace with your navigation logic
              style={styles.button}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Image style={styles.logo} source={require("../assets/sync.png")} />
            <View style={styles.explanation}>
              <AppText style={styles.explanationText}>
                To synchronize data between the EMA application and Omron HG
                data, please click on the provided link. This link will guide
                you to the server for configuring data integration with the
                FitBit server.
              </AppText>
            </View>
            <AppButton
              title="Omron HG Connection"
              onPress={() =>
                Linking.openURL(
                  "http://3.227.70.118:9000/auth/omron?user_id=" + user.userId
                )
              }
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
    borderRadius: 20,
  },
  explanationText: {
    padding: 15,
    color: colors.white,
    borderRadius: 20,
    textAlign: "justify",
    fontFamily: fonts.fifthRegular,
  },
  loading: {
    alignSelf: "center",
  },

  mycontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5cb85c",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5cb85c",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OmronConnectScreen;
