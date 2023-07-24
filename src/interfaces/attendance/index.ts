import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AttendanceInterface {
  id?: string;
  user_id?: string;
  attendance_date?: any;
  attendance_status?: boolean;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface AttendanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
