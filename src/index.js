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
  // This is the root component of our app. The router is used to create different pages. 
  // Currently all of PDL is located at "Home" and effectively works as a single page app.
  <BrowserRouter>
        <Routes>
            <Route path="Page1" element={<App page = {"Page1"} />} />
            <Route path="/" element={<App page = {"Home"}/>}/>
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
