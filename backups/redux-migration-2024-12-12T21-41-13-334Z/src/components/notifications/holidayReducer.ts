import { HolidayState, HolidayAction } from './types';

export const initialState: HolidayState = {
  holidays: [],
  loading: false,
  error: null,
  selectedHoliday: null,
  currentPage: 1,
  previewMessage: '',
  showConfirmation: false,
};

export function holidayReducer(state: HolidayState, action: HolidayAction): HolidayState {
  switch (action.type) {
    case 'SET_HOLIDAYS':
      return {
        ...state,
        holidays: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_SELECTED_HOLIDAY':
      return {
        ...state,
        selectedHoliday: action.payload,
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'SET_PREVIEW':
      return {
        ...state,
        previewMessage: action.payload,
      };
    case 'SET_CONFIRMATION':
      return {
        ...state,
        showConfirmation: action.payload,
      };
    case 'CLEAR_STATE':
      return initialState;
    default:
      return state;
  }
}
