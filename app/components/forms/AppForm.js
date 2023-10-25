import React from "react";
import { Formik } from "formik";

function AppForm({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  name,
}) {
  // Ensure the field specified by 'name' is initialized as an empty array
  if (!initialValues[name]) {
    initialValues[name] = [];
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {() => <>{children}</>}
    </Formik>
  );
}

export default AppForm;
