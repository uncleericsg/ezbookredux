import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ServiceState } from '../types/state.types';
import type { ServiceProvider, ServiceVisit } from '@/types/services';

const initialState: ServiceState = {
  services: [],
  isLoading: false,
  error: null,
  selectedService: null,
  currentService: null,
  filters: {
    category: null,
    status: null,
    date: null
  }
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ServiceProvider[]>) => {
      state.services = action.payload;
    },
    setSelectedService: (state, action: PayloadAction<string | null>) => {
      state.selectedService = action.payload;
    },
    setCurrentService: (state, action: PayloadAction<ServiceVisit | null>) => {
      state.currentService = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<ServiceState['filters']>) => {
      state.filters = action.payload;
    },
    clearServiceState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setServices,
  setSelectedService,
  setCurrentService,
  setLoading,
  setError,
  setFilters,
  clearServiceState
} = serviceSlice.actions;

export default serviceSlice.reducer;
