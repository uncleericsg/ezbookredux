// @ts-nocheck
 
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  amcStatus: string;
  nextServiceDate?: string;
  lastServiceDate?: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
