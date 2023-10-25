import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import endpointURL from "../api/serverPoint";

import authStorage from "../auth/storage";

function MessagesScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getGMessages = async () => {
    try {
      const token = await authStorage.getToken();

      const response = await fetch(endpointURL + "/gmessages", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGMessages();
  }, []);

  const { user } = useAuth();
  if (user.catdog == "Cat") {
    var imSource = require("../assets/catadmin.jpg");
  } else {
    var imSource = require("../assets/dogadmin.jpg");
  }

  return (
    <Screen>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              subTitle={item.description}
              image={imSource}
              onPress={() => navigation.navigate(routes.MESSAGE_DETAILS, item)}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      )}
    </Screen>
  );
}

export default MessagesScreen;
