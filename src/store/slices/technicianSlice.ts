import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TechnicianProfile, TechnicianSchedule } from '../../types/technician';

// Define the initial state
export const initialState = {
  currentTechnician: null as TechnicianProfile | null,
  technicians: [] as TechnicianProfile[],
  schedules: [] as TechnicianSchedule[],
  loading: false,
  error: null as string | null,
};

export type TechnicianState = typeof initialState;

const technicianSlice = createSlice({
  name: 'technician',
  initialState,
  reducers: {
    setCurrentTechnician: (state, action: PayloadAction<TechnicianProfile | null>) => {
      state.currentTechnician = action.payload;
    },
    setTechnicians: (state, action: PayloadAction<TechnicianProfile[]>) => {
      state.technicians = action.payload;
    },
    updateTechnicianStatus: (
      state,
      action: PayloadAction<{ technicianId: string; status: TechnicianProfile['status'] }>
    ) => {
      const { technicianId, status } = action.payload;
      if (state.currentTechnician?.id === technicianId) {
        state.currentTechnician.status = status;
      }
      const techIndex = state.technicians.findIndex(tech => tech.id === technicianId);
      if (techIndex !== -1) {
        state.technicians[techIndex].status = status;
      }
    },
    updateTechnicianLocation: (
      state,
      action: PayloadAction<{
        technicianId: string;
        latitude: number;
        longitude: number;
      }>
    ) => {
      const { technicianId, latitude, longitude } = action.payload;
      const location = {
        latitude,
        longitude,
        lastUpdated: new Date().toISOString()
      };
      
      if (state.currentTechnician?.id === technicianId) {
        state.currentTechnician.currentLocation = location;
      }
      const techIndex = state.technicians.findIndex(tech => tech.id === technicianId);
      if (techIndex !== -1) {
        state.technicians[techIndex].currentLocation = location;
      }
    },
    setSchedules: (state, action: PayloadAction<TechnicianSchedule[]>) => {
      state.schedules = action.payload;
    },
    updateScheduleStatus: (
      state,
      action: PayloadAction<{ scheduleId: string; status: TechnicianSchedule['status'] }>
    ) => {
      const { scheduleId, status } = action.payload;
      const scheduleIndex = state.schedules.findIndex(schedule => schedule.id === scheduleId);
      if (scheduleIndex !== -1) {
        state.schedules[scheduleIndex].status = status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentTechnician,
  setTechnicians,
  updateTechnicianStatus,
  updateTechnicianLocation,
  setSchedules,
  updateScheduleStatus,
  setLoading,
  setError,
} = technicianSlice.actions;

export default technicianSlice.reducer;
