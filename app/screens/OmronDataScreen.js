import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, Image, View } from "react-native";
import moment from "moment";

import Screen from "../components/Screen";

import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import AppRecordText from "../components/AppRecordText";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

function OmronDataScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getRecords = async () => {
    try {
      const token = await authStorage.getToken();
      const response = await fetch(endpointURL + "/omronhg", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  const { user } = useAuth();

  //console.log(data);

  var newArray = data.filter(
    (d) =>
      d.user_id == user.userId &&
      d.diastolic !== -2147483648 &&
      d.systolic !== -2147483648 &&
      d.pulse !== -2147483648
  );
  //console.log(newArray.length);

  const NoRecordsIcon = require("../assets/nocontent.png");

  const NoRecordsComponent = () => (
    <View style={styles.noRecordsContainer}>
      <Image source={NoRecordsIcon} style={styles.noRecordsIcon} />
      <Text style={styles.noRecordsText}>
        No BP measurement registered yet!
      </Text>
    </View>
  );

  return (
    <>
      <Screen style={styles.screen}>
        {isLoading ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif.gif")}
          />
        ) : (
          <FlatList
            data={newArray}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <AppRecordText>
                <Text style={styles.logodescColor}>
                  Systolic: {item.systolic}; {"\n"}
                  Diastolic: {item.diastolic}; {"\n"}
                  Pulse: {item.pulse}; {"\n"}
                </Text>
                <Text style={{ color: colors.black }}>@:</Text>
                {moment(item.datetime_local).format(
                  "dddd, MMMM Do YYYY - h:mm a"
                )}
              </AppRecordText>
            )}
            ListEmptyComponent={NoRecordsComponent}
          />
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
  logodescColor: {
    color: colors.black,
    fontWeight: "bold",
  },
  loading: {
    alignSelf: "center",
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50, // Adjust as needed
    marginHorizontal: 30, // Gives some space from the screen edges
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  noRecordsText: {
    fontSize: 18,
    color: colors.medium,
    marginTop: 16, // Spacing between icon and text
    textAlign: "center",
  },
  noRecordsIcon: {
    width: 100, // Adjust based on your icon's size
    height: 100, // Adjust based on your icon's size
  },
});

export default OmronDataScreen;
