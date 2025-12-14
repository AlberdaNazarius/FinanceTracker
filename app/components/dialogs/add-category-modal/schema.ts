import * as yup from 'yup';

export const schema = yup.object({
  name: yup.string().min(1).required("Name is required"),
  type: yup.string().required("Type is required"),
  color: yup.string().required("Color is required"),
  icon: yup.string().required("Icon is required"),
});