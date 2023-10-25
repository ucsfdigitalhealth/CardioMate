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
  const selectedItems = values[name] || [];

  const handleSelectItem = (item) => {
    const updatedItems = [...selectedItems];
    const itemIndex = updatedItems.findIndex(
      (selectedItem) => selectedItem.value === item.value
    );

    if (itemIndex === -1) {
      updatedItems.push(item);
    } else {
      updatedItems.splice(itemIndex, 1);
    }
    setFieldValue(name, updatedItems);
  };

  const handleRemoveItem = (item) => {
    // Remove the item from the selectedItems array
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem.value !== item.value
    );
    setFieldValue(name, updatedItems);
  };

  return (
    <>
      <AppPicker
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={handleSelectItem}
        onRemoveItem={handleRemoveItem} // Pass the handleRemoveItem function
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItems={selectedItems}
      />
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
