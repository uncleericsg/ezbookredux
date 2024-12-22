import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Common selectors
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.user);
export const useAdmin = () => useAppSelector((state) => state.admin);
export const useTechnician = () => useAppSelector((state) => state.technician);

// Specific technician selectors
export const useCurrentTechnician = () => useAppSelector((state) => state.technician.currentTechnician);
export const useTechnicianSchedules = () => useAppSelector((state) => state.technician.schedules);
export const useAllTechnicians = () => useAppSelector((state) => state.technician.technicians);
