import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import store from '@store/store';

const App = () => {
  return (
    <Provider store={store}>
      <Outlet />
      <Toaster position="top-right" />
    </Provider>
  );
};

export default App;
