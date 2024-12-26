import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminView, toggleAdminView } from './slices/adminView.slice';

export const useAdminView = () => {
  const dispatch = useDispatch();
  const isAdminView = useSelector((state) => state.adminView.isAdminView);

  return {
    isAdminView,
    setAdminView: (value: boolean) => dispatch(setAdminView(value)),
    toggleAdminView: () => dispatch(toggleAdminView()),
  };
};
