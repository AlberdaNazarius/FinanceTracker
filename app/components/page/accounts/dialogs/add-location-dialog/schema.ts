import * as yup from "yup";

export const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  currency_id: yup
    .number()
    .typeError("Currency is required")
    .required("Currency is required"),
  color: yup.string().required("Color is required"),
  icon: yup.string().required("Icon is required"),
});
