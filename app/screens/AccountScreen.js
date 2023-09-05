import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";

import ListItem from "../components/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";

const menuItems = [
  {
    title: "My Questionnaire",
    icon: {
      name: "head-question-outline",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const response = await fetch(endpointURL + "/users");
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

  //console.log("==========---------");
  //console.log(userDataArray[0].badge);
  //console.log("==========---------");
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
              <Text>Loading...</Text>
            ) : (
              filteredUserData[0].badge.toString()
            )
          }
          image={require("../assets/star.png")}
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
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.title)}
            />
          )}
        />
      </View>
      <ListItem
        title="FitBit Connection"
        IconComponent={
          <Icon name="sync-circle" backgroundColor={colors.primary} />
        }
        onPress={() => navigation.navigate("Downloads")}
      />
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
