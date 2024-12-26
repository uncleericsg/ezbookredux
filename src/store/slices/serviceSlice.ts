import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';
import { ServiceOption } from '@constants/serviceConfig';

export interface ServiceRequest {
  id: string;
  serviceType: string;
  serviceTitle: string;
  price: number;
  duration: string;
  isSignatureService: boolean;
  isAmcService: boolean;
}

interface ServiceState {
  currentRequest: ServiceRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  currentRequest: null,
  loading: false,
  error: null
};

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setCurrentRequest: (state, action: PayloadAction<ServiceOption>) => {
      state.currentRequest = {
        id: action.payload.id,
        serviceType: action.payload.id,
        serviceTitle: action.payload.title,
        price: action.payload.price,
        duration: action.payload.duration,
        isSignatureService: action.payload.isSignature || false,
        isAmcService: false
      };
      state.error = null;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  }
});

export const { setCurrentRequest, clearCurrentRequest, setError } = serviceSlice.actions;

export const selectCurrentService = (state: RootState) => state.service.currentRequest;
export const selectServiceError = (state: RootState) => state.service.error;

export default serviceSlice.reducer;
