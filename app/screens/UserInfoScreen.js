import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import UserInfoTabNavigator from "../navigation/UserInfoTabNavigator";
import { navigationRef } from "../navigation/rootNavigation";

function UserInfoScreen({ route, navigation }) {
  const userParams = route.params;

  return (
    <NavigationContainer independent={true}>
      <UserInfoTabNavigator userParams={userParams} navigation={navigation} />
    </NavigationContainer>
  );
}

export default UserInfoScreen;
