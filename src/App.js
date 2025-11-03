// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Wardrobe from "./components/Wardrobe";
import UpperWear from "./components/UpperWear";
import TrialRoom from "./components/TrialRoom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ConfirmSignUp from "./components/ConfirmSignUp";
import HomePage from "./components/HomePage";
import "./index.css";
import { getCurrentUser, signOut } from "aws-amplify/auth";

// Designer pages placeholders
function UploadPage() {
  return <h1 className="p-6 text-2xl font-bold text-gray-700">Upload Images</h1>;
}
function ProfilePage() {
  return <h1 className="p-6 text-2xl font-bold text-gray-700">Profile</h1>;
}
function FavoritesPage() {
  return <h1 className="p-6 text-2xl font-bold text-gray-700">Favorites</h1>;
}
function CollectionsPage() {
  return <h1 className="p-6 text-2xl font-bold text-gray-700">Collections</h1>;
}
function MorePage() {
  return <h1 className="p-6 text-2xl font-bold text-gray-700">More Options</h1>;
}

// Authenticated Route wrapper
function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };
    checkUser();
  }, []);

  if (isAuth === null) return <div className="p-6 text-center">Loading...</div>;
  return isAuth ? children : <Navigate to="/signin" />;
}

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-center space-x-6 sticky top-0 z-50">
        {!isAuthenticated ? (
          <>
            <CustomNavLink to="/">Home</CustomNavLink>
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

      {/* Routes */}
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm-signup" element={<ConfirmSignUp />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/wardrobe"
            element={
              <PrivateRoute>
                <Wardrobe />
              </PrivateRoute>
            }
          />
          <Route
            path="/upper-wear"
            element={
              <PrivateRoute>
                <UpperWear />
              </PrivateRoute>
            }
          />
          <Route
            path="/trial-room"
            element={
              <PrivateRoute>
                <TrialRoom />
              </PrivateRoute>
            }
          />

          {/* Stylish Sidebar Pages */}
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/collections"
            element={
              <PrivateRoute>
                <CollectionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/more"
            element={
              <PrivateRoute>
                <MorePage />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<div className="p-6 text-center">Page not found</div>} />
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
