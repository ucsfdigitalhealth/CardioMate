import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UserRecordScreen from "../screens/UserRecordScreen";
import UserStatisticScreen from "../screens/UserStatisticScreen";
import ChatScreen from "../screens/ChatScreen";
import UserFeedbackScreen from "../screens/UserFeedbackScreen";
import UserBPScreen from "../screens/UserBPScreen";

const Tab = createMaterialTopTabNavigator();

function UserInfoTabNavigator({ userParams, navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Logs"
        children={() => <UserRecordScreen userParams={userParams} />}
      />
      <Tab.Screen
        name="Stats"
        children={() => <UserStatisticScreen userParams={userParams} />}
      />
      <Tab.Screen
        name="BP"
        children={() => <UserBPScreen userParams={userParams} />}
      />
      <Tab.Screen
        name="FB"
        children={() => <UserFeedbackScreen userParams={userParams} />}
      />
      <Tab.Screen
        name="Chats"
        children={() => (
          <ChatScreen userParams={userParams} navigation={navigation} />
        )}
      />
    </Tab.Navigator>
  );
}

export default UserInfoTabNavigator;
