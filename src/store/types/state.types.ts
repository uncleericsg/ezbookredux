import { AdminState } from './admin.types';
import { AuthState } from './auth.types';
import { BookingState } from './booking.types';
import { ServiceState } from './service.types';
import { TechnicianState } from './technician.types';
import { UserState } from './user.types';

export interface RootState {
  admin: AdminState;
  auth: AuthState;
  booking: BookingState;
  service: ServiceState;
  technician: TechnicianState;
  user: UserState;
}
