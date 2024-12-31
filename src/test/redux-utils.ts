import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';

export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createTestStore>;
export type AppDispatch = AppStore['dispatch'];
