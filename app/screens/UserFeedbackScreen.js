import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, Image, View } from "react-native";
import moment from "moment";
import AppRecordText from "../components/AppRecordText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";
import fonts from "../config/fonts";

function UserFeedbackScreen({ userParams }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getFeedbacks = async () => {
    try {
      const token = await authStorage.getToken();
      const rResponse = await fetch(endpointURL + "/feedbacks", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const fJson = await rResponse.json();
      const myFeedbackArray = fJson.filter((d) => d.user_id == userParams?.id);
      setData(myFeedbackArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  const NoRecordsIcon = require("../assets/nocontent.png");

  const NoRecordsComponent = () => (
    <View style={styles.noRecordsContainer}>
      <Image source={NoRecordsIcon} style={styles.noRecordsIcon} />
      <Text style={styles.noRecordsText}>No feedbacks registered yet!</Text>
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
        <FlatList
          data={data}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.categoryLabel}>{item.category_label}</Text>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={NoRecordsComponent}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.bgcolor, // Light background color
  },
  loading: {
    alignSelf: "center",
    marginTop: 50,
  },
  feedbackItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryLabel: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: fonts.fifthBoldItalic,
  },
  description: {
    color: colors.darkGray,
    fontSize: 14,
    fontFamily: fonts.fifthRegular,
  },
  descriptionLabel: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: fonts.fifthBoldItalic,
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

export default UserFeedbackScreen;
