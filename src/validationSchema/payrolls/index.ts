import * as yup from 'yup';

export const payrollValidationSchema = yup.object().shape({
  salary: yup.number().integer(),
  user_id: yup.string().nullable(),
});
