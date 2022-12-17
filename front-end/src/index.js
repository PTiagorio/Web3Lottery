import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LotteryScreen from './MainScreen';
import AdminScreen from './AdminScreen';
import reportWebVitals from './reportWebVitals';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <LotteryScreen/>,
  },
  {
    path: '/adminScreen',
    element: <AdminScreen/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}>
    </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();