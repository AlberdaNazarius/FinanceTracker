import * as yup from 'yup';

export const schema = yup.object({
  username: yup.string().required("Name is required"),
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Must be a valid email address'),
  password: yup
    .string()
    .required("Password is required")
    .min(8, 'Password must be at least 8 characters long.'),
  confirm_password: yup
    .string()
    .required('You must confirm your password.')
    .oneOf(
      [yup.ref('password')],
      'Passwords must match.'
    ),
});