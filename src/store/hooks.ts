import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Common selectors
const useAuth = () => useAppSelector((state) => state.auth);
const useUser = () => useAppSelector((state) => state.user);
const useAdmin = () => useAppSelector((state) => state.admin);
const useTechnician = () => useAppSelector((state) => state.technician);

// Specific technician selectors
const useCurrentTechnician = () => useAppSelector((state) => state.technician.currentTechnician);
const useTechnicianSchedules = () => useAppSelector((state) => state.technician.schedules);
const useAllTechnicians = () => useAppSelector((state) => state.technician.technicians);

// Export all hooks
export {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useUser,
  useAdmin,
  useTechnician,
  useCurrentTechnician,
  useTechnicianSchedules,
  useAllTechnicians
};
