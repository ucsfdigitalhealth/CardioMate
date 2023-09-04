import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import moment from "moment";

import Screen from "../components/Screen";

import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import AppRecordText from "../components/AppRecordText";
import endpointURL from "../api/serverPoint";

function ListingsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getRecords = async () => {
    try {
      const response = await fetch(endpointURL + "/records");
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

  console.log(data);

  var newArray = data.filter((d) => d.user_id == user.userId);
  console.log(newArray.length);

  return (
    <>
      <Screen style={styles.screen}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={newArray}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <AppRecordText>
                <Text style={styles.logodescColor}>
                  {item.crave_use}: {item.substance_fruit} {"\n"}
                </Text>
                {moment(item.created_at).format(" dddd MMM Do, YYYY - hh:mm a")}
              </AppRecordText>
            )}
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
});

export default ListingsScreen;
