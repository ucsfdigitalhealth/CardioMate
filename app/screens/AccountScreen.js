import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

import ListItem from "../components/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);

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

  console.log("==========---------");
  console.log(filteredUserData);
  console.log("==========---------");
  if (user.catdog == "Cat") {
    var imSource = require("../assets/catuser.png");
  } else {
    var imSource = require("../assets/doguser.png");
  }

  return (
    <Screen>
      <View style={styles.container}>
        <ListItem title={user.name} subTitle={user.email} image={imSource} />
        <ListItem
          title="Your Awarded Stars:"
          subTitle={
            isLoading || filteredUserData.length === 0 ? (
              <Text>0</Text>
            ) : (
              filteredUserData[0].badge.toString()
            )
          }
          image={require("../assets/star.png")}
          onPress={() => navigation.navigate("Stars")}
        />
      </View>
      <View style={styles.container}>
        <ListItem
          title="My Records"
          IconComponent={
            <Icon
              name="format-list-bulleted"
              backgroundColor={colors.darkGreen}
            />
          }
          onPress={() => navigation.navigate("Records")}
        />

        <ListItem
          title="My Questionnaire"
          IconComponent={
            <Icon
              name="head-question-outline"
              backgroundColor={colors.primary}
            />
          }
          onPress={() => navigation.navigate("My Questionnaire")}
        />

        <ListItem
          title="My Messages"
          IconComponent={
            <Icon name="email" backgroundColor={colors.secondary} />
          }
          onPress={() => navigation.navigate("My Messages")}
        />
      </View>
      <ListItem
        title="FitBit Connection"
        IconComponent={
          <Icon name="sync-circle" backgroundColor={colors.primary} />
        }
        onPress={() => navigation.navigate("FitBit Connection")}
      />
      {isLoading ||
      filteredUserData.length === 0 ||
      filteredUserData[0].access_type.toString() === "user" ? null : (
        <ListItem
          title="ID Finder"
          IconComponent={
            <Icon
              name="database-search-outline"
              backgroundColor={colors.primary}
            />
          }
          onPress={() => navigation.navigate("ID Finder")}
        />
      )}
      <View style={styles.container}>
        <ListItem
          title="Log Out"
          IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
          onPress={() => logOut()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
});

export default AccountScreen;
