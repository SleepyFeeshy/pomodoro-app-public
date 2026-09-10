import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js"
import { BrowserRouter } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.css';
import "./App.css"

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
)