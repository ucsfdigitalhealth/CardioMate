import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { Permissions } from "expo-permissions";
import { registerForPushNotificationsAsync } from "./app/notificationUtils";
import { scheduleNotificationAsync } from "expo-notifications";

import AuthNavigator from "./app/navigation/AuthNavigator";
import NavigationTheme from "./app/navigation/NavigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import { Accelerometer, Gyroscope } from "expo-sensors";
import axios from "axios";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

SplashScreen.preventAutoHideAsync();

/// Background

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log("Got a background task!");

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // task will fire 1 minute after app is backgrounded
    stopOnTerminate: false, // Android only
    startOnBoot: true, // Android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

///

/// Notification

const scheduleNotifications = async () => {
  const notificationTimes = [
    { hour: 9, minute: 0 },
    { hour: 13, minute: 0 },
    { hour: 17, minute: 0 },
    { hour: 21, minute: 0 },
  ];

  const now = new Date();

  for (const time of notificationTimes) {
    const triggerTime = new Date(now);
    triggerTime.setHours(time.hour, time.minute, 0, 0);

    if (triggerTime <= now) {
      // If the trigger time is in the past, schedule for the next day
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    await scheduleNotificationAsync({
      content: {
        title: "Your Notification Title",
        body: "This is the body of your notification",
      },
      trigger: {
        date: triggerTime,
        repeats: true,
        seconds: 0,
      },
    });
  }
};

///

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  useEffect(() => {
    async function prepare() {
      try {
        restoreUser();
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();

    registerForPushNotificationsAsync(); // Request permissions and initialize notifications
    scheduleNotifications();

    let accelerometerSubscription;
    let gyroscopeSubscription;
    let currentUser;

    const startSensorDataCollection = async () => {
      try {
        await restorecUser(); // Wait for the currentUser to be available
        if (currentUser) {
          accelerometerSubscription = await Accelerometer.addListener(
            (accelerometerData) => {
              // Handle accelerometer data
              console.log("Accelerometer data:", accelerometerData);
              sendDataToServer({
                sensorType: "accelerometer",
                data: accelerometerData,
              });
            }
          );

          gyroscopeSubscription = await Gyroscope.addListener(
            (gyroscopeData) => {
              // Handle gyroscope data
              console.log("Gyroscope data:", gyroscopeData);
              sendDataToServer({
                sensorType: "gyroscope",
                data: gyroscopeData,
              });
            }
          );

          await Accelerometer.setUpdateInterval(1000); // 1 second
          await Gyroscope.setUpdateInterval(1000);
        }
      } catch (error) {
        console.error("Error starting sensor data collection:", error);
      }
    };

    const sendDataToServer = (data) => {
      const timestamp = new Date().toISOString();
      const payload = { userId: currentUser?.userId, timestamp, ...data };

      axios
        .post("http:///192.168.86.30:9000/save-sensor-data", payload)
        .then(() => {
          console.log("Sensor data sent to server");
        })
        .catch((error) => {
          console.error("Error sending sensor data to server:", error);
        });
    };

    const restorecUser = async () => {
      const cuser = await authStorage.getUser();
      if (cuser) {
        currentUser = cuser;
      } else {
        currentUser = null;
      }
    };

    registerBackgroundFetchAsync();
    startSensorDataCollection();

    return () => {
      accelerometerSubscription && accelerometerSubscription.remove();
      gyroscopeSubscription && gyroscopeSubscription.remove();
      unregisterBackgroundFetchAsync();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  ////// sensor

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer
        ref={navigationRef}
        theme={NavigationTheme}
        onReady={onLayoutRootView}
      >
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
