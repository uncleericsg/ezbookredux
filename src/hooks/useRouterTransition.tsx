import { useNavigate as useRouterNavigate, useLocation, NavigateOptions } from 'react-router-dom';
import { startTransition, useCallback } from 'react';

export function useNavigate() {
  const navigate = useRouterNavigate();
  const wrappedNavigate = useCallback(
    (to: string | number, options?: NavigateOptions) => {
      startTransition(() => {
        navigate(to, options);
      });
    },
    [navigate]
  );
  return wrappedNavigate;
}

export function useTransitionLocation() {
  const location = useLocation();
  return location;
}
