// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
// 1. Import BrowserRouter
import { BrowserRouter } from "react-router-dom";

// Configure Amplify with your Cognito setup
Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* 2. Wrap your App component here */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);