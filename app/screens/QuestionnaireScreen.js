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
import routes from "../navigation/routes";
import PickerItem from "../components/PickerItem";
import CategoryPickerItemColumn from "../components/CategoryPickerItemColumn";

const validationSchema = Yup.object().shape({
  //images: Yup.array().min(1, "Please select at least one image."),
  category: Yup.object().required().nullable().label("Category"),
});

const fruits = [
  {
    label: "None",
    value: 1,
    backgroundColor: "red",
    icon: require("../assets/animations/none.png"),
  },
  {
    label: "Melon",
    value: 2,
    backgroundColor: "green",
    icon: require("../assets/animations/melon.png"),
  },
  {
    label: "Almond",
    value: 3,
    backgroundColor: "green",
    icon: require("../assets/animations/almond.png"),
  },
  {
    label: "Carrot",
    value: 4,
    backgroundColor: "green",
    icon: require("../assets/animations/carrot.png"),
  },
  {
    label: "Orange",
    value: 5,
    backgroundColor: "green",
    icon: require("../assets/animations/orange.png"),
  },
  {
    label: "Coconut",
    value: 6,
    backgroundColor: "green",
    icon: require("../assets/animations/coconut.png"),
  },
  {
    label: "Strawberry",
    value: 7,
    backgroundColor: "green",
    icon: require("../assets/animations/strawberry.png"),
  },
  {
    label: "Nectarine",
    value: 8,
    backgroundColor: "green",
    icon: require("../assets/animations/nectarine.png"),
  },
  {
    label: "Others",
    value: 9,
    backgroundColor: "green",
    icon: require("../assets/animations/others.png"),
  },
];

const substanceTypes = [
  { label: "None", value: 1 },
  { label: "Methamphetamine", value: 2 },
  { label: "Alcohol", value: 3 },
  { label: "Cannabis (marijuana, pakalolo)", value: 4 },
  { label: "Opioid (e.g., heroin, fentanyl, oxycodone)", value: 5 },
  { label: "Cocaine", value: 6 },
  { label: "Sedative/benzodiazepine", value: 7 },
  { label: "Nicotine (cigarettes or e-cigarettes)", value: 8 },
  { label: "Others", value: 9 },
];

const craveUse = [
  {
    label: "Crave",
    value: 1,
    backgroundColor: "red",
    icon: require("../assets/animations/crave.png"),
  },
  {
    label: "Use",
    value: 2,
    backgroundColor: "green",
    icon: require("../assets/animations/use.png"),
  },
  {
    label: "None",
    value: 3,
    backgroundColor: "green",
    icon: require("../assets/animations/none.png"),
  },
];

function QuestionnaireScreen({ navigation }) {
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

  const { user } = useAuth();
  //var hours = new Date().getHours();
  //console.log(user);
  if (user.preference == "Fruit") {
    var finalId = 0;
    var imSource = require("../assets/animations/fruits.png");
    var finalCategory = fruits;
    var pickerType = CategoryPickerItemColumn;
    var columnNum = 2;
    var placeHolder = "Fruit Types";
  } else {
    var finalId = 0;
    var imSource = require("../assets/animations/selection.png");
    var finalCategory = substanceTypes;
    var pickerType = PickerItem;
    var columnNum = 1;
    var placeHolder = "Substance Types";
  }

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // const navPage = () => {
  //   navigation.navigate("QuestionnaireStep2", { step1Data: listing });
  // };
  const handleSubmit = async (listing) => {
    navigation.navigate(routes.QUESTIONNAIRE_STEP2, { step1Data: listing });
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
            items={finalCategory}
            placeholder={placeHolder}
            icon="paw"
            name="category"
            numberOfColumns={columnNum}
            PickerItemComponent={pickerType}
          />

          <AppFormPicker
            items={craveUse}
            placeholder="Crave/Use"
            icon="paw"
            name="craveuse"
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
  quScreen: {
    padding: 10,
  },
});
