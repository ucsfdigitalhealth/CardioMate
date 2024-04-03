// QuestionnaireStep1Screen.js

import React, { useState } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import {
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import CategoryPickerItem from "../components/CategoryPickerItem";
import AppFormPickerSingle from "../components/forms/AppFormPickerSingle";
import routes from "../navigation/routes";
import AppFormTextInput from "../components/forms/AppFormTextInput";
import AppFormDateTimePicker from "../components/forms/AppFormDateTimePicker";
import listingsApi from "../api/listings";
import { CommonActions } from "@react-navigation/native";
import CategoryPickerItemSingleColumn from "../components/forms/CategoryPickerItemSingleColumn";

const generateValidationSchema = (mainAnswers) => {
  const schemaFields = {
    mood: Yup.object().nullable().required().label("Mood"),
    stressLevel: Yup.object()
      .nullable()
      .required("Stress level is required")
      .label("Stress Level"),
  };

  // Adjusting to check the first item of the array
  if (mainAnswers.interaction.value === "yes") {
    schemaFields.interactionDetail = Yup.string()
      .required()
      .label("Interaction Detail");
  }
  if (mainAnswers.physicalDiscomfort.value === "yes") {
    schemaFields.discomfortDetail = Yup.string()
      .required()
      .label("Discomfort Detail");
  }
  if (mainAnswers.medication.value === "yes") {
    schemaFields.medicationDetail = Yup.string()
      .required()
      .label("Medication Detail");
    schemaFields.medicationDate = Yup.date()
      .nullable()
      .required("Medication date is required")
      .label("Medication Date");
  }
  if (mainAnswers.environment.value === "others") {
    schemaFields.environmentDetail = Yup.string()
      .required()
      .label("Environment Detail");
  }

  return Yup.object().shape(schemaFields);
};

const moodOptions = [
  {
    label: "Very Happy",
    value: "very_happy",
    backgroundColor: "red",
    icon: require("../assets/animations/very_happy.png"),
  },
  {
    label: "Happy",
    value: "happy",
    backgroundColor: "green",
    icon: require("../assets/animations/happy.png"),
  },
  {
    label: "Neutral",
    value: "neutral",
    backgroundColor: "green",
    icon: require("../assets/animations/neutral.png"),
  },
  {
    label: "Unhappy",
    value: "unhappy",
    backgroundColor: "green",
    icon: require("../assets/animations/unhappy.png"),
  },
  {
    label: "Very Unhappy",
    value: "very_unhappy",
    backgroundColor: "green",
    icon: require("../assets/animations/very_unhappy.png"),
  },
];

// const moodOptions = [
//   { label: "Happy", value: "happy" },
//   { label: "Very Happy", value: "very_happy" },
//   { label: "Neutral", value: "neutral" },
//   { label: "Unhappy", value: "unhappy" },
//   { label: "Very Unhappy", value: "very_unhappy" },
// ];

const stressLevel = [
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

function QuestionnaireStep1Screen({ route, navigation }) {
  const { mainAnswers } = route.params;
  //console.log(mainAnswers);
  const validationSchema = generateValidationSchema(mainAnswers);

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const navPage = () => {
    navigation.navigate("Home");
  };

  const { user } = useAuth();

  const handleSubmit = async (step1Values, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);

    // Mapping mainAnswers to their corresponding step1Values
    const combinedData = {
      userId: user.userId,
      responses: {
        interaction: {
          answer: mainAnswers.interaction.value,
          detail: step1Values.interactionDetail,
        },
        physicalDiscomfort: {
          answer: mainAnswers.physicalDiscomfort.value,
          detail: step1Values.discomfortDetail,
        },
        environment: {
          answer: mainAnswers.environment.value,
          detail: step1Values.environmentDetail,
        },
        medication: {
          answer: mainAnswers.medication.value,
          detail: step1Values.medicationDetail,
          date: step1Values.medicationDate,
        },
        mood: step1Values.mood,
        stressLevel: step1Values.stressLevel,
      },
    };

    // API call
    setTimeout(async () => {
      const result = await listingsApi.addListing(combinedData, (progress) =>
        setProgress(progress)
      );

      if (!result.ok) {
        setUploadVisible(false);
        Alert.alert("Could not save the data");
      } else {
        setTimeout(() => {
          navPage();
          resetForm();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }], // Adjust navigation as needed
            })
          );
        }, 2000); // Adjust delay as needed
      }
    }, 1000); // Adjust delay as needed
  };

  const renderConditionalQuestions = () => {
    const components = [];

    if (mainAnswers.interaction.value === "yes") {
      components.push(
        <React.Fragment key="interactionFragment">
          <AppFormText>Who have you interacted with?</AppFormText>
          <AppFormTextInput
            name="interactionDetail"
            placeholder="Please describe shortly..."
            multiline
            numberOfLines={7}
          />
        </React.Fragment>
      );
    }
    if (mainAnswers.physicalDiscomfort.value === "yes") {
      components.push(
        <React.Fragment key="discomfortFragment">
          <AppFormText>
            Describe your physical discomfort or symptoms.
          </AppFormText>
          <AppFormTextInput
            name="discomfortDetail"
            placeholder="Please describe shortly..."
            multiline
            numberOfLines={7}
          />
        </React.Fragment>
      );
    }
    if (mainAnswers.medication.value === "yes") {
      components.push(
        <React.Fragment key="medicationFragment">
          <AppFormText>What medications have you used?</AppFormText>
          <AppFormTextInput
            name="medicationDetail"
            placeholder="Please describe shortly..."
            multiline
            numberOfLines={7}
          />
          <AppFormText>When did you take the medication?</AppFormText>
          <AppFormDateTimePicker
            name="medicationDate"
            placeholder="Select Date and Time"
          />
        </React.Fragment>
      );
    }
    if (mainAnswers.environment.value === "others") {
      components.push(
        <React.Fragment key="environmentFragment">
          <AppFormText>Describe your current environment.</AppFormText>
          <AppFormTextInput
            name="environmentDetail"
            placeholder="Please describe shortly..."
            multiline
            numberOfLines={7}
          />
        </React.Fragment>
      );
    }

    return components;
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <AppForm
          initialValues={{
            interactionDetail: "",
            discomfortDetail: "",
            medicationDetail: "",
            environmentDetail: "",
            mood: "",
            stressLevel: 0,
            medicationDate: null, // initial value for the date/time picker
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {renderConditionalQuestions()}

          <AppFormText>How would you rate your current mood?</AppFormText>
          <AppFormPickerSingle
            name="mood"
            items={moodOptions}
            placeholder="Select Mood"
            icon="paw"
            numberOfColumns={1}
            PickerItemComponent={CategoryPickerItemSingleColumn}
          />

          <AppFormText>
            On a scale of 0-10, how stressed do you feel right now? (Where 0
            indicates no stress at all, and 10 signifies extreme stress.)
          </AppFormText>
          <AppFormPickerSingle
            name="stressLevel"
            items={stressLevel}
            placeholder="Select Stress Level"
            icon="paw"
            numberOfColumns={1}
            PickerItemComponent={CategoryPickerItem}
          />

          <SubmitButton title="Submit" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
}

export default QuestionnaireStep1Screen;

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
});
