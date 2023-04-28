import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// const root = ReactDOM.createRoot(document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
        <Routes>
            <Route path="Page1" element={<App page = {"Page1"} />} />
            <Route path="Page2" element={<App page = {"Page2"}/>} />
            <Route path="/" element={<App page = {"Home"}/>}/>
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
