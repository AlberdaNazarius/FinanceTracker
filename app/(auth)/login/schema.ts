import * as yup from 'yup';

export const schema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Must be a valid email address'),
  password: yup
    .string()
    .required("Password is required")
    .min(8, 'Password must be at least 8 characters long.'),
});