import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import authStorage from "../auth/storage";
import endpointURL from "../api/serverPoint";
import React, { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import colors from "../config/colors";
import HomeCard from "../components/HomeCard";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import listingsApi from "../api/listings";
import useApi from "../hooks/useApi";
import Screen from "../components/Screen";
import Icon from "../components/Icon";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import fonts from "../config/fonts";

const listings = [
  {
    id: 1,
    title: "My Questionnaire",
    description: "",
    images: require("../assets/animations/qu_full.jpg"),
  },
  {
    id: 2,
    title: "My Messages",
    description: "",
    images: require("../assets/animations/me_full.jpg"),
  },
  {
    id: 3,
    title: "My Records",
    description: "",
    images: require("../assets/animations/re_full.jpg"),
  },
  {
    id: 4,
    title: "My Feedback",
    description: "",
    images: require("../assets/animations/fe_full.jpg"),
  },
  {
    id: 5,
    title: "HeartGuide Data",
    description: "",
    images: require("../assets/animations/he_full.jpg"),
  },
  {
    id: 6,
    title: "App Instructions",
    description: "",
    images: require("../assets/animations/h_full.jpg"),
  },
];

function ListingsScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [error, setError] = useState(null);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const [responseUnreadCount, setResponseUnreadCount] = useState(0);
  const isFocused = useIsFocused();

  const { logOut, user } = useAuth();

  const getMessagesResponses = async () => {
    try {
      const token = await authStorage.getToken();

      // Fetch all messages
      const messageResponse = fetch(endpointURL + "/gmessages", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      // Fetch all responses
      const userResponseResponse = fetch(endpointURL + "/mresponses", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      // Wait for both requests to complete
      const [message, response] = await Promise.all([
        messageResponse,
        userResponseResponse,
      ]);

      if (!message.ok) {
        throw new Error("Network response was not ok for messages");
      }
      if (!response.ok) {
        throw new Error("Network response was not ok for responses");
      }

      const messageJson = await message.json();
      const responseJson = await response.json();

      // Filter for unread messages where user_id matches
      const unreadMessages = messageJson.filter(
        (msg) => msg.status === "unread" && msg.user_id === user.userId
      );

      // Filter for unread responses where admin_id matches
      const unreadResponses = responseJson.filter(
        (rsp) => rsp.status === "unread" && rsp.admin_id === user.userId
      );

      // Update state with filtered data and counts
      setMessageUnreadCount(unreadMessages.length);
      setMessageData(messageJson);
      setResponseUnreadCount(unreadResponses.length);
      setData(responseJson);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(
    (isFocused) => {
      getMessagesResponses();
    },
    [isFocused]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();
  const imageWidth = Dimensions.get("window").width - 32; // Adjust based on your image width and padding

  const images = [
    {
      source: require("../assets/healthgraphic.png"),
      url: "http://bit.ly/3Ph51Dc",
    },
    {
      source: require("../assets/websitereferral.png"),
      url: "https://hawaiidigitalhealthlab.com/",
    },
  ];

  const scrollBy = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
      newIndex = 0; // Prevent scrolling before the first image
    } else if (newIndex >= images.length) {
      newIndex = images.length - 1; // Prevent scrolling past the last image
    }

    setCurrentIndex(newIndex);
    scrollViewRef.current.scrollTo({
      x: newIndex * imageWidth,
      y: 0,
      animated: true,
    });
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.logoShadow}>
          <Image
            source={require("../assets/hearticon.png")} // Replace with the actual path to your image
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.headerText}>CardioMate</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => logOut()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <TouchableOpacity
          onPress={() => scrollBy(-1)}
          style={{ position: "absolute", left: 10, zIndex: 1 }}
        >
          <Icon
            name="arrow-left-drop-circle-outline"
            backgroundColor={colors.bgcolor}
            size={45}
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(item.url)}
              style={[styles.image, { width: imageWidth }]}
            >
              <Image source={item.source} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => scrollBy(1)}
          style={{ position: "absolute", right: 10, zIndex: 1 }}
        >
          <Icon
            name="arrow-right-drop-circle-outline"
            backgroundColor={colors.bgcolor}
            size={45}
          />
        </TouchableOpacity>
      </View>
      <Screen style={styles.liScreen}>
        <FlatList
          data={listings}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <View>
              <HomeCard
                title={item.title}
                subTitle={item.description}
                imageUrl={item.images}
                onPress={() => navigation.navigate(item.title)}
              />
              {item.title === "My Messages" &&
                (messageUnreadCount > 0 || responseUnreadCount > 0) && (
                  <View style={styles.unreadBubble}>
                    <Text style={styles.unreadText}>
                      {messageUnreadCount > 0
                        ? messageUnreadCount
                        : responseUnreadCount}
                    </Text>
                  </View>
                )}
            </View>
          )}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  topacity: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 999,
    fontWeight: "bold",
  },
  banner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginHorizontal: 12,
    marginBottom: 10,
    position: "relative", // Added for absolute positioning of arrows
  },
  image: { width: 350, height: 220, borderRadius: 20 },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonImage: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  text: {
    color: colors.darkGray,
    fontSize: 12,
  },
  buttonOpacity: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    marginRight: 8, // Add this for horizontal spacing
    marginBottom: 8, // Add this for vertical spacing
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  liScreen: {
    padding: 5,
  },
  row: {
    justifyContent: "space-around",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.secondary, // Choose a light color for the background
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 5, // for Android
  },
  headerText: {
    color: colors.darkGreen,
    fontWeight: "bold",
    fontSize: 24,
    textShadowColor: colors.darkGray,
    textShadowRadius: 2,
  },
  logoutButton: {
    padding: 12,
    paddingHorizontal: 17,
    backgroundColor: colors.bgcolor, // A contrasting color for the button
    borderWidth: 1,
    borderColor: colors.secondary, // A border color that complements the button color
    borderRadius: 20,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 3, // for Android
  },
  logoutText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.white, // Text color that contrasts with the button color
    fontFamily: fonts.fifthSemiBoldItalic,
  },
  unreadBubble: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "white",
    fontWeight: "bold",
  },
  logoImage: {
    width: 50,
    height: 50,
  },
});

export default ListingsScreen;
