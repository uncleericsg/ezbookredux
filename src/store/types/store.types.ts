import type { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RootState } from './state.types';

export type { RootState };
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AsyncThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra: { srv: { supabase: SupabaseClient } };
};