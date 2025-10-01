import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Wardrobe from "./components/Wardrobe";
import UpperWear from "./components/UpperWear";
import TrialRoom from "./components/TrialRoom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ConfirmSignUp from "./components/ConfirmSignUp";
import "./index.css";
import { Amplify } from "aws-amplify";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await Amplify.Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await Amplify.Auth.signOut();
      setIsAuthenticated(false);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      alert(error.message || "Error signing out");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md p-4 flex justify-center space-x-6">
        {!isAuthenticated ? (
          <>
            <CustomNavLink to="/signin">Sign In</CustomNavLink>
            <CustomNavLink to="/signup">Sign Up</CustomNavLink>
          </>
        ) : (
          <>
            <CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
            <CustomNavLink to="/wardrobe">Wardrobe</CustomNavLink>
            <CustomNavLink to="/upper-wear">Upper Wear</CustomNavLink>
            <CustomNavLink to="/trial-room">Trial Room</CustomNavLink>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/signin"
            element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<SignUp />} />
           <Route path="/confirm-signup" element={<ConfirmSignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/upper-wear" element={<UpperWear />} />
          <Route path="/trial-room" element={<TrialRoom />} />
        </Routes>
      </div>
    </div>
  );
}

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
