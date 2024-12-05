import { useState } from "react";
import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="">
        <Toaster />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
