import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import Home from "./Pages/Home";
import Landing from "./Pages/Landing";


function App() {
  return (
    <Router >
      <Routes>
        <Route path="/Home" element={<Home/>}/>
        <Route path="*" element={<Landing/>} />
      </Routes>
    </Router>
  );
}

export default App;
