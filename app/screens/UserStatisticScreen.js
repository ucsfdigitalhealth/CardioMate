import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
} from "react-native";
import moment from "moment";
import AppRecordText from "../components/AppRecordText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import fonts from "../config/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

function UserStatisticScreen({ userParams }) {
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
      const rResponse = await fetch(endpointURL + "/records", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const rJson = await rResponse.json();
      const myRecordArray = rJson.filter((d) => d.user_id == userParams?.id);
      setData(myRecordArray);
      const { moodCounts, stressLevelCounts } =
        computeStatistics(myRecordArray);
      setStats({
        totalRecords: myRecordArray.length,
        moodCounts,
        stressLevelCounts,
      });
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

  return (
    <>
      <Screen style={styles.screen}>
        {isLoading ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif.gif")}
          />
        ) : (
          <ScrollView>
            <View style={styles.contentContainer}>
              <View style={styles.card}>
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.cardTitle}>Total Records</Text>
                <Text style={styles.cardValue}>{stats.totalRecords}</Text>
              </View>

              <View style={styles.card}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={colors.gold}
                />
                <Text style={styles.cardTitle}>Stars Received</Text>
                <Text style={styles.cardValue}>{stats.totalRecords / 14}</Text>
              </View>

              <View style={styles.card}>
                <MaterialCommunityIcons
                  name="emoticon-happy"
                  size={24}
                  color={colors.green}
                />
                <Text style={styles.cardTitle}>Mood Values</Text>
                {Object.entries(stats.moodCounts).map(([mood, count]) => (
                  <Text key={mood} style={styles.statsDetail}>
                    {mood}: {count}
                  </Text>
                ))}
              </View>

              <View style={styles.card}>
                <MaterialCommunityIcons
                  name="speedometer"
                  size={24}
                  color={colors.red}
                />
                <Text style={styles.cardTitle}>Stress Levels</Text>
                {Object.entries(stats.stressLevelCounts).map(
                  ([level, count]) => (
                    <Text key={level} style={styles.statsDetail}>
                      {level}: {count}
                    </Text>
                  )
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgcolor,
  },
  contentContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.secondary,
    marginTop: 5,
  },
  statsDetail: {
    fontSize: 16,
    color: colors.medium,
    marginTop: 3,
  },
  logodescColor: {
    color: colors.black,
    fontWeight: "bold",
  },
  loading: {
    alignSelf: "center",
  },
  statsContainer: {
    backgroundColor: colors.primary, // Choose a theme color
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // for Android
  },
  statsTitle: {
    color: colors.darkGray,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsText: {
    color: colors.darkGray,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default UserStatisticScreen;
