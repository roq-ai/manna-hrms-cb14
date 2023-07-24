import * as yup from 'yup';

export const attendanceValidationSchema = yup.object().shape({
  attendance_date: yup.date(),
  attendance_status: yup.boolean(),
  user_id: yup.string().nullable(),
});
