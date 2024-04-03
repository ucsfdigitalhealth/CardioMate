import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import RecordNavigator from "./RecordNavigator";
import FeedNavigator from "./FeedNavigator";
import NewListingButton from "./NewListingButton";
import expoPushTokensApi from "../api/expoPushTokens";
import navigation from "./rootNavigation";
import { scheduleNotifications } from "../components/NotificationSender";
import Constants from "expo-constants";
import fonts from "../config/fonts";
import AccountNavigator from "./AccountNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState();

  const registerForPushNotifications = async () => {
    try {
      console.log("Dochi");
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) return;
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(token);
      expoPushTokensApi.register(token);
    } catch (error) {
      console.log("Error getting a push token in app navigator", error);
    }
  };

  useEffect(() => {
    console.log("Yechi");
    registerForPushNotifications();

    Notifications.addPushTokenListener((notification) => {
      navigation.navigate("My Questionnaire");
    });

    ////////////////////////////////////////////
    const notificationListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigation.navigate("My Questionnaire");
        setInitialRoute("HomeScreen");
      });
    ///////////////////////////////////////////

    scheduleNotifications();

    return () => {
      notificationListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: fonts.fifthBoldItalic,
        },
      }}
      initialRouteName={initialRoute}
    >
      <Tab.Screen
        name="HomeScreen"
        component={RecordNavigator}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton onPress={() => navigation.navigate("Home")} />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="My Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="card-account-details-star-outline"
              color={color}
              size={42}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
