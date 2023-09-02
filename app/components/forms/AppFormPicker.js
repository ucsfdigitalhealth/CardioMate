import React from "react";
import { useFormikContext } from "formik";

import AppPicker from "../AppPicker";
import CustomErrorMessage from "./CustomErrorMessage";

function AppFormPicker({
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  return (
    <>
      <AppPicker
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
      />
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
