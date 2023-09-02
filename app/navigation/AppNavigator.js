import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import RecordNavigator from "./RecordNavigator";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import FeedNavigator from "./FeedNavigator";
import NewListingButton from "./NewListingButton";
import expoPushTokensApi from "../api/expoPushTokens";
import navigation from "./rootNavigation";
import colors from "../config/colors";
import QuestionnaireStep2Screen from "../screens/QuestionnaireStep2Screen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  useEffect(() => {
    registerForPushNotifications();
    Notifications.addPushTokenListener((notification) =>
      navigation.navigate("My Account")
    );
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) return;
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      expoPushTokensApi.register(token);
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="My Account"
        component={RecordNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="badge-account-horizontal-outline"
              color={color}
              size={35}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Questionnaires"
        component={FeedNavigator}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate("Questionnaires")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
