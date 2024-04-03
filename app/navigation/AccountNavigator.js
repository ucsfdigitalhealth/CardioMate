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
import OmronConnectScreen from "../screens/OmronConnectScreen";
import UsersScreen from "../screens/UsersScreen";
import UserInfoScreen from "../screens/UserInfoScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontFamily: fonts.fifthBoldItalic,
      },
    }}
  >
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Stars" component={StarsScreen} />
    <Stack.Screen name="My Questionnaire" component={QuestionnaireScreen} />
    <Stack.Screen
      name="Supplementary Info"
      component={QuestionnaireStep1Screen}
    />
    <Stack.Screen name="FitBit Connection" component={DownloadScreen} />
    <Stack.Screen name="OmronHG Connection" component={OmronConnectScreen} />
    <Stack.Screen name="Users List" component={UsersScreen} />
    <Stack.Screen name="User Info" component={UserInfoScreen} />
    <Stack.Screen name="Chat Details" component={ChatDetailsScreen} />
    <Stack.Screen name="ID Finder" component={IdFinderScreen} />
    <Stack.Screen name="User Info Details" component={IdFinderStep2Screen} />
  </Stack.Navigator>
);

export default AccountNavigator;
