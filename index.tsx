
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import { ToastProvider } from './context/ToastContext';
import { checkAuth } from './features/auth/authSlice';

store.dispatch(checkAuth());

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
