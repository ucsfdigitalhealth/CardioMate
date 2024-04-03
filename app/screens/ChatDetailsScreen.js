import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import messagesApi from "../api/messagesApi";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import fonts from "../config/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import authStorage from "../auth/storage";
import moment from "moment";

function ChatDetailsScreen({ route }) {
  const [message, setMessage] = useState("");
  const [combinedMessages, setCombinedMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const listing = route.params;

  const fetchMessageResponses = async () => {
    try {
      const token = await authStorage.getToken();

      const adminMessage = await fetch(endpointURL + "/gmessages", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      const response = await fetch(endpointURL + "/mresponses", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!adminMessage.ok) {
        throw new Error("Network response was not ok for message session");
      }
      if (!response.ok) {
        throw new Error("Network response was not ok for response session");
      }

      const messageJson = await adminMessage.json();
      const responseJson = await response.json();
      setResponses(responseJson);

      const combinedData = [
        ...messageJson
          .filter(
            (msg) =>
              msg.chat_id === listing.id && msg.user_id === listing.user_id
          )
          .map((msg) => ({
            ...msg,
            type: "admin",
            uniqueKey: `admin-${msg.id}`,
          })),
        ...responseJson
          .filter(
            (resp) =>
              resp.chat_id === listing.id && resp.user_id === listing.user_id
          )
          .map((resp) => ({
            ...resp,
            type: "user",
            uniqueKey: `user-${resp.id}`,
          })),
      ];

      combinedData.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setCombinedMessages(combinedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessageResponses();
  }, []);

  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (message) {
      await messagesApi.postMessage({
        chat_id: listing.id, // Assuming listing.id is your message ID
        response_id: responses[0].id,
        message_text: message,
        user_id: listing.user_id,
        admin_id: user.userId, // Replace with actual user ID
        status: "unread",
      });
      setMessage("");
      fetchMessageResponses(); // Fetch latest responses
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = messages.reduce((acc, message) => {
      const date = moment(message.created_at).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([date1], [date2]) =>
      moment(date1).diff(moment(date2))
    );
  };

  // Modify renderMessage function
  const renderMessage = (item) => {
    const messageStyle =
      item.type === "admin" ? styles.adminMessages : styles.responses;
    const messageText =
      item.type === "admin" ? item.message_text : item.response_text;

    return (
      <View key={item.uniqueKey} style={messageStyle}>
        <AppText style={styles.messageText}>{messageText}</AppText>
        <AppText style={styles.messageTimestamp}>
          {moment(item.created_at).format("h:mm a")}
        </AppText>
      </View>
    );
  };

  const content = (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.detailsContainer}>
          {groupMessagesByDate(combinedMessages).map(([date, messages]) => (
            <View key={date}>
              <AppText style={styles.dateHeader}>
                {moment(date).format("dddd, MMMM Do YYYY")}
              </AppText>
              {messages.map((message, index, arr) =>
                renderMessage(message, index === arr.length - 1)
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message here..."
          placeholderTextColor={colors.darkGray}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <MaterialCommunityIcons
            name="send"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Screen style={{ flex: 1 }}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={130}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensures that the input field is pushed to the bottom
  },
  messageInputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 5,
    alignItems: "center",
    backgroundColor: colors.white,
    paddingBottom: 22,
  },
  detailsContainer: {
    padding: 20,
    alignItems: "stretch",
  },
  messages: {
    backgroundColor: colors.secondary,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    color: colors.white,
    textAlign: "left",
    fontFamily: fonts.fifthRegular,
  },
  responses: {
    backgroundColor: colors.primary,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    maxWidth: "70%",
    alignSelf: "flex-end", // Align to the right
    marginRight: 10, // Add some right margin
    color: colors.white,
    textAlign: "left",
    fontFamily: fonts.fifthRegular,
    alignSelf: "flex-end", // Align to the right
    marginRight: 10,
  },
  adminMessages: {
    backgroundColor: colors.secondary,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    maxWidth: "70%",
    alignSelf: "flex-start", // Align to the left
    marginLeft: 10, // Add some left margin
    color: colors.white,
    textAlign: "left",
    fontFamily: fonts.fifthRegular,
    alignSelf: "flex-start", // Align to the left
    marginLeft: 10, // Left margin
  },
  messageText: {
    color: colors.white,
    textAlign: "left",
    fontFamily: fonts.fifthRegular,
  },
  messageTimestamp: {
    fontSize: 12,
    color: colors.medium, // Choose an appropriate color
    alignSelf: "flex-end", // Align the timestamp to the end of the message
    marginTop: 2, // Add some space between the message and the timestamp
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
  titleContainer: {
    backgroundColor: colors.darkGreen,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  messageInput: {
    flex: 1,
    borderColor: colors.medium,
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.dark,
    paddingVertical: 8,
    textAlign: "center",
    backgroundColor: colors.lightGray, // Or any other color
    width: "100%",
    marginBottom: 10,
  },
});

export default ChatDetailsScreen;
