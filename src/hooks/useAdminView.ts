import { useAppDispatch, useAppSelector } from '../store';
import { setAdminView, toggleAdminView } from '../store/slices/adminView.slice';

export const useAdminView = () => {
  const dispatch = useAppDispatch();
  const isAdminView = useAppSelector((state) => state.adminView.isAdminView);

  return {
    isAdminView,
    setAdminView: (value: boolean) => dispatch(setAdminView(value)),
    toggleAdminView: () => dispatch(toggleAdminView()),
  };
};
