import React, { useState, useEffect } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
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

const validationSchema = Yup.object().shape({
  //images: Yup.array().min(1, "Please select at least one image."),
  category: Yup.object().required().nullable().label("Category"),
});

const use = [
  { label: "Less than 1 hour ago", value: 1 },
  { label: "1-2 hours ago", value: 2 },
  { label: "2-4 hours ago", value: 3 },
  { label: "4-6 hours ago", value: 4 },
  { label: "6-8 hours ago", value: 5 },
  { label: "8-10 hours ago", value: 6 },
  { label: "More than 10 hours ago", value: 7 },
];

const crave = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
];

function QuestionnaireStep2Screen({ route, navigation }) {
  const { step1Data } = route.params;
  console.log(step1Data);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getQuestions = async () => {
    try {
      const response = await fetch(endpointURL + "/questions");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  console.log(step1Data);

  const { user } = useAuth();
  var hours = new Date().getHours();
  if (hours != null) {
    if (step1Data.craveuse["label"] == "Use") {
      var finalId = 1;
      var finalSelect = use;
    } else if (step1Data.craveuse["label"] == "Crave") {
      var finalId = 2;
      var finalSelect = crave;
    } else {
      var finalId = 3;
      var finalSelect = crave;
    }
    var imSource = require("../assets/animations/thinking.png");
  }

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const navPage = () => {
    navigation.navigate("Questionnaires");
  };
  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing({ ...listing }, (progress) =>
      setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return Alert.alert("Could not save the listing");
    }
    navPage();
    resetForm();

    // Reset the stack to the HomeScreen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Account" }],
      })
    );
  };

  return (
    <Screen style={styles.quScreen}>
      <ScrollView>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <AppForm
          initialValues={{
            cquestion: isLoading ? 404 : data[finalId].id,
            category: null,
            cuser: user.userId,
            substanceValue: step1Data.category["value"],
            substanceLabel: step1Data.category["label"],
            cuseValue: step1Data.craveuse["value"],
            cuseLabel: step1Data.craveuse["label"],
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <AppFormText name="hcquestion">{data[finalId].quest}</AppFormText>
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
            source={imSource}
          />

          <AppFormPicker
            items={finalSelect}
            placeholder="Answer"
            icon="paw"
            name="category"
            PickerItemComponent={PickerItem}
          />

          <SubmitButton title="Post" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
}
export default QuestionnaireStep2Screen;

const styles = StyleSheet.create({
  quScreen: {
    padding: 10,
  },
});
