// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Wardrobe from "./components/Wardrobe";
import UpperWear from "./components/UpperWear";
import TrialRoom from "./components/TrialRoom";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-center space-x-6">
          <CustomNavLink to="/">Dashboard</CustomNavLink>
          <CustomNavLink to="/wardrobe">Wardrobe</CustomNavLink>
          <CustomNavLink to="/upper-wear">Upper Wear</CustomNavLink>
          <CustomNavLink to="/trial-room">Trial Room</CustomNavLink>
        </nav>

        {/* Pages */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/upper-wear" element={<UpperWear />} />
            <Route path="/trial-room" element={<TrialRoom />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Using react-router-dom's NavLink to get active link styling
function CustomNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1 rounded-lg transition ${
          isActive
            ? "bg-orange-200 text-orange-700 font-semibold"
            : "text-gray-600 hover:bg-orange-100 hover:text-orange-600"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default App;
