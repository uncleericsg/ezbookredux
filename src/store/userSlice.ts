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
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
