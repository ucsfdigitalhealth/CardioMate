import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Button,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import colors from "../config/colors";
import messagesApi from "../api/messagesApi";
import endpointURL from "../api/serverPoint";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import { navigationRef } from "../navigation/rootNavigation";

import authStorage from "../auth/storage";

function ChatScreen({ userParams, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [chats, setChats] = useState([]);

  const { user } = useAuth();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = await authStorage.getToken();

      const response = await fetch(endpointURL + "/chats", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const relevantChats = json.filter(
        (chat) => chat.user_id === userParams.id
      );
      setChats(relevantChats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userParams.id]);

  const OpenCreateChat = () => {
    setModalVisible(true);
  };

  const navigateToChatDetails = (chat) => {
    navigation.navigate("Chat Details", chat);
  };

  const handleCreateChat = async () => {
    console.log("This is userId now: ", user.userId);
    if (newChatTitle) {
      const chatData = {
        title: newChatTitle,
        admin_id: user.userId,
        user_id: userParams.id,
      };

      const response = await messagesApi.createChat(chatData);
      if (response.ok) {
        fetchChats();
      } else {
        // Handle error in chat creation
        console.error("Failed to create chat");
      }

      setNewChatTitle("");
      setModalVisible(false);
    }
  };

  const NoRecordsIcon = require("../assets/nocontent.png");

  const NoRecordsComponent = () => (
    <View style={styles.noRecordsContainer}>
      <Image source={NoRecordsIcon} style={styles.noRecordsIcon} />
      <Text style={styles.noRecordsText}>No chats registered yet!</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen style={styles.screen}>
        {isLoading ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif.gif")}
          />
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(chat) => chat.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                image={require("../assets/dogadmin.jpg")}
                onPress={() => navigateToChatDetails(item)}
              />
            )}
            ItemSeparatorComponent={ListItemSeparator}
            ListEmptyComponent={NoRecordsComponent}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.modalText}
                placeholder="Enter Chat Title"
                placeholderTextColor={colors.lightGray}
                value={newChatTitle}
                onChangeText={setNewChatTitle}
              />
              <Button
                title="Create Chat"
                onPress={() => {
                  handleCreateChat(newChatTitle);
                  setModalVisible(false);
                  setNewChatTitle("");
                }}
                color={colors.primary}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Screen>
      <TouchableOpacity style={styles.addButton} onPress={OpenCreateChat}>
        <MaterialCommunityIcons name="plus-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>New Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // Ensure Screen component takes up full space
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary, // Example color
    padding: 10,
    borderRadius: 30,
    zIndex: 1,
  },
  addButtonText: {
    color: "white",
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "space-between",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    // Additional styles for the text input
  },
  closeButton: {
    marginTop: 10, // Spacing from the 'Create Chat' button
    alignSelf: "center", // Center the button
  },
  closeButtonText: {
    color: colors.primary, // Blue text color
    fontSize: 16, // Font size for the text
  },
  loading: {
    alignSelf: "center",
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

export default ChatScreen;
