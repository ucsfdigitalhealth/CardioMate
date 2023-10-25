import React, { useState, useEffect } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import { ScrollView, StyleSheet, Alert, Image, Text } from "react-native";
import listingsApi from "../api/listings";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import endpointURL from "../api/serverPoint";
import CategoryPickerItem from "../components/CategoryPickerItem";
import PickerItem from "../components/PickerItem";
import { CommonActions, useNavigation } from "@react-navigation/native";
import authStorage from "../auth/storage";
import AppFormPickerSingle from "../components/forms/AppFormPickerSingle";

const validationSchema = Yup.object().shape({
  //images: Yup.array().min(1, "Please select at least one image."),
  category: Yup.object().required().nullable().label("Your input"),
});

function IdFinderStep2Screen({ route }) {
  const { step1Data } = route.params;
  //console.log(step1Data);
  const [isLoading, setLoading] = useState(true);
  const [userArray, setUserArray] = useState([]);
  const [recordNumber, setRecordNumber] = useState([]);
  const [badge, setBadge] = useState([]);

  const getUsers = async () => {
    try {
      const token = await authStorage.getToken();
      const uResponse = await fetch(endpointURL + "/users", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const uJson = await uResponse.json();
      //console.log(rJson);
      const myUserArray = uJson.filter((d) => d.email == step1Data.email);
      setUserArray(myUserArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(userArray);

  const getRecords = async () => {
    try {
      const token = await authStorage.getToken();
      const rResponse = await fetch(endpointURL + "/records", {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const rJson = await rResponse.json();
      const myRecordArray = rJson.filter((d) => d.user_id == user.userId);
      var lenRecordArray = myRecordArray.length;
      setRecordNumber(lenRecordArray);
      var userBadge = Math.floor(lenRecordArray / 4);
      setBadge(userBadge);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getRecords();
  }, []);
  // console.log("88888888888888888888888");
  //console.log(recordArray);
  // console.log("88888888888888888888888");

  //console.log(step1Data.category.map((item) => item.value));

  const { user } = useAuth();

  return (
    <Screen style={styles.quScreen}>
      <ScrollView>
        {isLoading || userArray.length === 0 ? (
          <Image
            style={styles.loading}
            source={require("../assets/animations/loading_gif_s.gif")}
          />
        ) : (
          <>
            <AppFormText>Email: {userArray[0].email}</AppFormText>
            <AppFormText>Age: {userArray[0].ageCategory}</AppFormText>
            <AppFormText>Gender: {userArray[0].genCategory}</AppFormText>
            <AppFormText>ID: {userArray[0].id}</AppFormText>
            <AppFormText>Badge: {badge}</AppFormText>
            <AppFormText>Record's Number: {recordNumber}</AppFormText>
          </>
        )}

        <Image
          style={{
            width: "100%",
            height: 370,
            borderRadius: 30,
            overlayColor: colors.bgcolor,
            overflow: "hidden",
            marginVertical: 15,
          }}
          source={require("../assets/finded_user.png")}
        />
      </ScrollView>
    </Screen>
  );
}
export default IdFinderStep2Screen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
  loading: {
    alignSelf: "center",
  },
});
