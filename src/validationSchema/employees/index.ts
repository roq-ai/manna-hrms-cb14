import * as yup from 'yup';

export const employeeValidationSchema = yup.object().shape({
  onboarding_status: yup.boolean(),
  probation_status: yup.boolean(),
  exit_status: yup.boolean(),
  user_id: yup.string().nullable(),
});
