import { store } from './store';
import type { RootState, AppDispatch } from './store';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { RESET_STORE, resetStore } from './rootReducer';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, RESET_STORE, resetStore };
export type { RootState, AppDispatch };