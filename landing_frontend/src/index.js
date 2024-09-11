import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LoaderProvider } from './context/loaderContext';
import Loader from './component/loader';
import { ToastProvider } from './context/toastContext';
import { AuthContextProvider } from './context/authContext';
import CartList from './component/cartList';
import { CartProvider } from './context/cartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <LoaderProvider>
        <AuthContextProvider>
          <CartProvider>
            <Loader />
            <CartList />
            <App />
          </CartProvider>
        </AuthContextProvider>
      </LoaderProvider>
    </ToastProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
