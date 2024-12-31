import { useMemo } from 'react';
import { BASE_CATEGORIES, AMC_CATEGORY } from '../config/serviceCategories';

export const useServiceCategories = (isAmcCustomer: boolean) => {
  return useMemo(() => {
    const categories = [...BASE_CATEGORIES];
    if (isAmcCustomer) {
      categories.unshift(AMC_CATEGORY);
    }
    return categories;
  }, [isAmcCustomer]);
};
