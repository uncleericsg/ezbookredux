import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  settings: {
    theme: string;
    notifications: boolean;
    maintenance: boolean;
  };
  users: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  settings: {
    theme: 'light',
    notifications: true,
    maintenance: false,
  },
  users: [],
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<AdminState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addUser: (state, action: PayloadAction<any>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<{ id: string; updates: any }>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.updates };
      }
    },
  },
});

export const {
  updateSettings,
  setUsers,
  setLoading,
  setError,
  addUser,
  removeUser,
  updateUser,
} = adminSlice.actions;

export default adminSlice.reducer;
