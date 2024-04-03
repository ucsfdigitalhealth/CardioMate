import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TextInput } from "react-native";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import endpointURL from "../api/serverPoint";

import authStorage from "../auth/storage";
import colors from "../config/colors";
import ListItem2 from "../components/ListItem2";
import ListItem from "../components/ListItem";
import AdminScreen from "../components/AdminScreen";

function UsersScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  const getUsers = async () => {
    try {
      const token = await authStorage.getToken();

      const response = await fetch(endpointURL + "/users", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      //console.log(user);
      const filteredUsers = json.filter(
        (userItem) => userItem.id !== user.userId
      ); // Assuming 'id' is the property name for user ID

      setData(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (user.catdog == "Cat") {
    var imSource = require("../assets/catadmin.jpg");
  } else {
    var imSource = require("../assets/dogadmin.jpg");
  }

  return (
    <AdminScreen>
      {isLoading ? (
        <Image
          style={styles.loading}
          source={require("../assets/animations/loading_gif.gif")}
        />
      ) : (
        <>
          <TextInput
            style={styles.searchBar}
            placeholderTextColor={colors.darkGray}
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={data.filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(user) => user.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                title={item.name}
                subTitle={item.email}
                image={imSource}
                onPress={() => {
                  navigation.navigate(routes.USERS_INFO, item);
                }}
              />
            )}
            ItemSeparatorComponent={ListItemSeparator}
          />
        </>
      )}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignSelf: "center",
  },
  searchBar: {
    padding: 16,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: colors.white, // A darker background for contrast
    color: colors.darkGray, // White text color
    fontSize: 16, // Optional: Adjust font size as needed
  },
});

export default UsersScreen;
