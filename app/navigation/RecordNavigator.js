import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import RecordScreen from "../screens/RecordScreen";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MessageDetailsScreen from "../screens/MessageDetailsScreen";
import DownloadScreen from "../screens/DownloadScreen";
import QuestionnaireStep2Screen from "../screens/QuestionnaireStep2Screen";
import StarsScreen from "../screens/StarsScreen";
import IdFinderScreen from "../screens/IdFinderScreen";
import IdFinderStep2Screen from "../screens/IdFinderStep2Screen";
import fonts from "../config/fonts";
import FeedbackScreen from "../screens/FeedbackScreen";
import QuestionnaireStep1Screen from "../screens/QuestionnaireStep1Screen";
import ListingsScreen from "../screens/ListingsScreen";
import colors from "../config/colors";
import OmronDataScreen from "../screens/OmronDataScreen";
import InstructionsScreen from "../screens/InstructionsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";

const Stack = createStackNavigator();

const RecordNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontFamily: fonts.fifthBoldItalic,
      },
    }}
  >
    <Stack.Screen
      name="Home"
      component={ListingsScreen}
      options={{
        headerStyle: {
          backgroundColor: colors.bgcolor, // Specify your desired header background color
        },
        headerTintColor: "white", // Specify the text color for the header title
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen name="My Records" component={RecordScreen} />
    <Stack.Screen name="My Questionnaire" component={QuestionnaireScreen} />
    <Stack.Screen name="My Messages" component={MessagesScreen} />
    <Stack.Screen name="HeartGuide Data" component={OmronDataScreen} />
    <Stack.Screen name="Message Details" component={MessageDetailsScreen} />
    <Stack.Screen
      name="Supplementary Info"
      component={QuestionnaireStep1Screen}
    />
    <Stack.Screen
      name="One More Question!"
      component={QuestionnaireStep2Screen}
    />
    <Stack.Screen name="My Feedback" component={FeedbackScreen} />
    <Stack.Screen name="App Instructions" component={InstructionsScreen} />
    <Stack.Screen
      name="Guidance Details"
      component={ListingDetailsScreen}
      options={{ presentation: "modal" }}
    />
    <Stack.Screen name="User Info Details" component={IdFinderStep2Screen} />
  </Stack.Navigator>
);

export default RecordNavigator;
