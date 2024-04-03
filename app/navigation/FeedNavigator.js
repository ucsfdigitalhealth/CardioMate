import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator>
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
    <Stack.Screen
      name="Guidance Details"
      component={ListingDetailsScreen}
      options={{ presentation: "modal" }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
