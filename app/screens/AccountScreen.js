import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import ListItem from "../components/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";
import ListItemNoChevron from "../components/ListItemNoChevron";

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [badge, setBadge] = useState([]);
  const [recordNumber, setRecordNumber] = useState([]);

  const getUsers = async () => {
    try {
      const token = await authStorage.getToken(); // Retrieve the token
      if (!token) {
        throw new Error("Token not found"); // Check if the token exists
      }
      //console.log("Account Screen token:", token);
      const response = await fetch(endpointURL + "/users", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users"); // Check if the response is ok
      }
      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error("Expected an array of users"); // Check if the response is an array
      }
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
    if (user) {
      getUsers();
    }
  }, [user]);

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
      const myRecordArray = rJson.filter(
        (d) => d.user_id == filteredUserData[0]?.id
      );
      var lenRecordArray = myRecordArray.length;
      setRecordNumber(lenRecordArray);
      var userBadge = Math.floor(lenRecordArray / 14);
      setBadge(userBadge);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //console.log(badge);

  useEffect(() => {
    if (filteredUserData.length > 0) {
      getRecords();
    }
  }, [filteredUserData]);

  if (user.catdog == "Cat") {
    var imSource = require("../assets/catuser.png");
  } else {
    var imSource = require("../assets/doguser.png");
  }

  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <ListItemNoChevron
            title={user.name}
            subTitle={user.email}
            image={imSource}
          />
          <ListItem
            title="Your Awarded Stars:"
            subTitle={badge.toString()}
            image={require("../assets/star.png")}
            onPress={() => navigation.navigate("Stars")}
          />
        </View>

        <ListItem
          title="FitBit Connection"
          IconComponent={
            <Icon name="sync-circle" backgroundColor={colors.primary} />
          }
          onPress={() => navigation.navigate("FitBit Connection")}
        />
        <ListItem
          title="Omron HG Connection"
          IconComponent={
            <Icon name="sync-circle" backgroundColor={colors.primary} />
          }
          onPress={() => navigation.navigate("OmronHG Connection")}
        />

        {isLoading ||
        filteredUserData.length === 0 ||
        filteredUserData[0].access_type.toString() === "user" ? null : (
          <ListItem
            title="Users Management"
            IconComponent={
              <Icon name="account-circle" backgroundColor={colors.secondary} />
            }
            onPress={() => navigation.navigate("Users List")}
          />
        )}
        <View style={styles.container}>
          <ListItem
            title="Log Out"
            IconComponent={<Icon name="logout" backgroundColor="#ff0000" />}
            onPress={() => logOut()}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default AccountScreen;
