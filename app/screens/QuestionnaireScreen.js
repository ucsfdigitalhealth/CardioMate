// MainQuestionnaireScreen.js

import React from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
import { ScrollView, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import routes from "../navigation/routes";
import AppFormPickerSingle from "../components/forms/AppFormPickerSingle";

const validationSchema = Yup.object().shape({
  interaction: Yup.object().required().label("Interaction"),
  physicalDiscomfort: Yup.object().required().label("Physical Discomfort"),
  environment: Yup.object().required().label("Environment"),
  medication: Yup.object().required().label("Medication"),
});

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const environmentOptions = [
  { label: "Quiet", value: "quiet" },
  { label: "Noisy", value: "noisy" },
  { label: "Comfortable", value: "comfortable" },
  { label: "Stressful", value: "stressful" },
  { label: "Others", value: "others" },
];

function QuestionnaireScreen({ navigation }) {
  const handleSubmit = async (listing) => {
    // Filter out the 'undefined' key from the listing object
    const cleanedListing = Object.keys(listing).reduce((acc, key) => {
      if (key !== "undefined") {
        acc[key] = listing[key];
      }
      return acc;
    }, {});

    navigation.navigate(routes.QUESTIONNAIRE_STEP1, {
      mainAnswers: cleanedListing,
    });
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <AppForm
          initialValues={{
            interaction: "",
            physicalDiscomfort: "",
            environment: "",
            medication: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormText>Have you interacted with anyone?</AppFormText>
          <AppFormPickerSingle
            name="interaction"
            items={yesNoOptions}
            placeholder="Select"
            icon="paw"
            numberOfColumns={1}
            PickerItemComponent={CategoryPickerItem}
          />

          <AppFormText>
            Are you currently experiencing any physical discomfort or symptoms?
          </AppFormText>
          <AppFormPickerSingle
            name="physicalDiscomfort"
            items={yesNoOptions}
            placeholder="Select"
            icon="paw"
            numberOfColumns={1}
            PickerItemComponent={CategoryPickerItem}
          />

          <AppFormText>Describe your current environment.</AppFormText>
          <AppFormPickerSingle
            name="environment"
            items={environmentOptions}
            placeholder="Select"
            icon="paw"
            numberOfColumns={1}
            PickerItemComponent={CategoryPickerItem}
          />

          <AppFormText>Have you used any medications?</AppFormText>
          <AppFormPickerSingle
            name="medication"
            items={yesNoOptions}
            placeholder="Select"
            icon="paw"
            numberOfColumns={1}
            PickerItemComponent={CategoryPickerItem}
          />

          <SubmitButton title="Next" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
}

export default QuestionnaireScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
});
