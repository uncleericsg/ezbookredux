import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserViewType } from '@components/admin/AdminViewToggle';

interface AdminViewState {
  currentView: UserViewType;
}

const initialState: AdminViewState = {
  currentView: 'regular',
};

export const adminViewSlice = createSlice({
  name: 'adminView',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<UserViewType>) => {
      state.currentView = action.payload;
    },
    resetView: (state) => {
      state.currentView = 'regular';
    },
  },
});

export const { setCurrentView, resetView } = adminViewSlice.actions;
export const adminViewReducer = adminViewSlice.reducer;
