import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, Image, View } from "react-native";
import moment from "moment";
import AppRecordText from "../components/AppRecordText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

function UserBPScreen({ userParams }) {
  //const userParams = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [stats, setStats] = useState({
    totalRecords: 0,
    uniqueMoods: new Set(),
    uniqueStressLevels: new Set(),
  });

  const computeStatistics = (records) => {
    const moodCounts = {};
    const stressLevelCounts = {};

    records.forEach((record) => {
      moodCounts[record.mood_value] = (moodCounts[record.mood_value] || 0) + 1;
      stressLevelCounts[record.stressLevel_value] =
        (stressLevelCounts[record.stressLevel_value] || 0) + 1;
    });

    return { moodCounts, stressLevelCounts };
  };

  const getRecords = async () => {
    try {
      const token = await authStorage.getToken();
      const rResponse = await fetch(endpointURL + "/omronhg", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const rJson = await rResponse.json();
      const myRecordArray = rJson.filter((d) => d.user_id == userParams?.id);
      setData(myRecordArray);
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

  var newArray = data.filter(
    (d) =>
      d.diastolic !== -2147483648 &&
      d.systolic !== -2147483648 &&
      d.pulse !== -2147483648
  );

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
    <Screen style={styles.screen}>
      {isLoading ? (
        <Image
          style={styles.loading}
          source={require("../assets/animations/loading_gif.gif")}
        />
      ) : (
        <>
          <View style={styles.recordCounterContainer}>
            <Text style={styles.recordCounterText}>
              Total Records: {newArray.length}
            </Text>
          </View>
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
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.bgcolor,
  },
  recordItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordText: {
    color: colors.darkGray,
    fontSize: 16,
    marginBottom: 5,
  },
  recordValue: {
    fontWeight: "bold",
  },
  recordDate: {
    color: colors.medium,
    fontSize: 14,
    marginTop: 10,
  },
  loading: {
    alignSelf: "center",
    marginTop: 50,
  },
  recordCounterContainer: {
    backgroundColor: colors.lightGray, // Choose a color that fits your design
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center", // Centers the text horizontally
    justifyContent: "center", // Centers the text vertically
  },
  recordCounterText: {
    color: colors.darkGray, // Choose a text color that fits your design
    fontSize: 18,
    fontWeight: "bold",
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

export default UserBPScreen;
