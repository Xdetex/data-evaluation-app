// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/user/login";
import WelcomeBack from "./pages/user/welcome";
import MainLogin from "./pages/common/login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLogin />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/welcome" element={<WelcomeBack />} />
      </Routes>
    </Router>
  );
};

export default App;
