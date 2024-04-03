import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Linking, View, Text } from "react-native";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import endpointURL from "../api/serverPoint";
import messagesApi from "../api/messagesApi";
import { useIsFocused } from "@react-navigation/native";

import authStorage from "../auth/storage";
import colors from "../config/colors";

function MessagesScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [unreadChats, setUnreadChats] = useState(new Set());
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const token = await authStorage.getToken();

      // Fetch all chats, messages, and responses
      const chatResponse = fetch(endpointURL + "/chats", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const messageResponse = fetch(endpointURL + "/gmessages", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const responseResponse = fetch(endpointURL + "/mresponses", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      const [fetchedChats, fetchedMessages, fetchedResponses] =
        await Promise.all([chatResponse, messageResponse, responseResponse]);

      if (!fetchedChats.ok || !fetchedMessages.ok || !fetchedResponses.ok) {
        throw new Error("Network response was not ok");
      }

      const chatsJson = await fetchedChats.json();
      const messagesJson = await fetchedMessages.json();
      const responsesJson = await fetchedResponses.json();

      // Filter chats related to the user
      const relevantChats = chatsJson.filter(
        (chat) => chat.user_id === user.userId || chat.admin_id === user.userId
      );

      // Identify unread chats
      const unreadChatIds = new Set([
        ...messagesJson
          .filter(
            (msg) => msg.status === "unread" && msg.user_id === user.userId
          )
          .map((msg) => msg.chat_id),
        ...responsesJson
          .filter(
            (res) => res.status === "unread" && res.admin_id === user.userId
          )
          .map((res) => res.chat_id),
      ]);

      setChats(relevantChats);
      setUnreadChats(unreadChatIds);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(
    (isFocused) => {
      fetchData();
    },
    [isFocused]
  );

  const { user } = useAuth();
  if (user.catdog == "Cat") {
    var imSource = require("../assets/catadmin.jpg");
  } else {
    var imSource = require("../assets/dogadmin.jpg");
  }

  const handleSelectChat = async (chatId) => {
    try {
      setLoading(true);

      // Update message status
      const messageUpdate = messagesApi.updateMessageStatusByChatId(
        chatId,
        "read"
      );

      // Conditional update for admin type user
      let responseUpdate;
      if (user.access_type === "admin") {
        responseUpdate = messagesApi.updateResponseStatusByChatId(
          chatId,
          "read"
        );
        await Promise.all([messageUpdate, responseUpdate]);
      } else {
        await messageUpdate;
      }
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., display an alert or a message to the user)
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = unreadChats.has(item.id);
    return (
      <ListItem
        title={item.title}
        titleStyle={isUnread ? styles.unreadTitle : null}
        image={
          user.catdog === "Cat"
            ? require("../assets/catadmin.jpg")
            : require("../assets/dogadmin.jpg")
        }
        onPress={() => {
          handleSelectChat(item.id);
          navigation.navigate(routes.MESSAGE_DETAILS, item);
        }}
      />
    );
  };

  const NoRecordsIcon = require("../assets/nocontent.png");

  const NoRecordsComponent = () => (
    <View style={styles.noRecordsContainer}>
      <Image source={NoRecordsIcon} style={styles.noRecordsIcon} />
      <Text style={styles.noRecordsText}>No chats registered yet!</Text>
    </View>
  );

  return (
    <Screen>
      {isLoading ? (
        <Image
          style={styles.loading}
          source={require("../assets/animations/loading_gif.gif")}
        />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(chat) => chat.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={ListItemSeparator}
          ListEmptyComponent={NoRecordsComponent}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignSelf: "center",
  },
  unreadTitle: {
    color: "red",
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

export default MessagesScreen;
