//Dashboard.js->// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiUsers,
  FiHeart,
  FiGrid,
  FiUpload,
  FiLogOut,
  FiCloudRain,
  FiSun,
  FiCloud,
  FiAlertCircle,} from "react-icons/fi";
import { motion } from "framer-motion";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [userName, setUserName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ⛅ Your Lambda API endpoint
  const RECOMMEND_API =
    "https://qnvrtcxzdb.execute-api.us-east-1.amazonaws.com/dev/RecommendLambda"; // ← replace with your deployed Lambda endpoint

  // 📌 Fetch logged-in username
  useEffect(() => {
    const getUser = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name =
          attributes?.name || attributes?.preferred_username || "User";
        setUserName(name);
      } catch {
        setUserName("User");
      }
    };
    getUser();
  }, []);

  // 🌦 Fetch location + recommendations
  useEffect(() => {
    const fetchRecommendations = async (lat, lon, userId) => {
      try {
        const res = await fetch(RECOMMEND_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, lat, lon }),
        });
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setRecommendations(data.suggestions || []);
        setWeather(data.weather || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const getUserAndLocation = async () => {
      try {
        const attrs = await fetchUserAttributes();
        const userId = attrs?.sub || "demo-user";

        // 📍Get current location
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            fetchRecommendations(latitude, longitude, userId);
          },
          (err) => {
            console.error("Location error:", err);
            setError("Unable to get location. Please enable GPS.");
            setLoading(false);
          }
        );
      } catch {
        setError("Authentication error. Please log in again.");
        setLoading(false);
      }
    };

    getUserAndLocation();
  }, []);

  // 🚪 Sign Out
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  // 🌈 Weather Icon
  const WeatherIcon = () => {
    if (!weather) return <FiCloud className="text-gray-400" size={28} />;
    switch (weather.weatherMain) {
      case "Rain":
        return <FiCloudRain className="text-blue-400" size={28} />;
      case "Cloudy":
        return <FiCloud className="text-gray-500" size={28} />;
      case "Clear":
        return <FiSun className="text-yellow-400" size={28} />;
      default:
        return <FiAlertCircle className="text-gray-400" size={28} />;
    }
  };

  // 🧭 Sidebar link
  const LinkItem = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 text-lg text-gray-700 hover:text-orange-500 transition"
    >
      {icon} <span>{label}</span>
    </Link>
  );

  // 🌀 Loading state
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-400 mb-4"></div>
        Fetching outfit recommendations...
      </div>
    );

  // ❌ Error state
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <FiAlertCircle size={48} className="text-red-400 mb-3" />
        <p className="text-center max-w-md">{error}</p>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            {userName} 👋
          </span>
        </h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl text-gray-700 hover:text-orange-500 transition"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 260 }}
        className="fixed top-0 right-0 h-full w-64 bg-white/90 backdrop-blur-md shadow-2xl z-50"
      >
        <div className="flex flex-col p-6 space-y-6 mt-12">
          <LinkItem
            to="/wardrobe"
            icon={<FiUpload />}
            label="My Wardrobe"
            onClick={() => setMenuOpen(false)}
          />
          <LinkItem
            to="/profile"
            icon={<FiUsers />}
            label="Profile"
            onClick={() => setMenuOpen(false)}
          />
          <LinkItem
            to="/favorites"
            icon={<FiHeart />}
            label="Favorites"
            onClick={() => setMenuOpen(false)}
          />
          <LinkItem
            to="/collections"
            icon={<FiGrid />}
            label="Collections"
            onClick={() => setMenuOpen(false)}
          />
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-lg text-red-500 hover:text-red-600 transition"
          >
            <FiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Weather Info */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 flex items-center justify-center bg-white/80 rounded-2xl shadow-lg px-6 py-3 max-w-sm"
        >
          <WeatherIcon />
          <div className="ml-3 text-gray-700">
            <p className="font-semibold text-lg">{weather.weatherMain}</p>
            <p className="text-sm">
              Temperature:{" "}
              <span className="font-medium">{weather.tempC}°C</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <div className="mt-10 px-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Recommended Outfits for You 👗
        </h2>

        {recommendations.length === 0 ? (
          <p className="text-center text-gray-500">
            No outfit recommendations found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {recommendations.map((rec, idx) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                <img
                  src={rec.url}
                  alt={rec.category || "outfit"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    {rec.category || "Outfit"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Labels: {rec.labels?.slice(0, 3).join(", ")}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Weather Fit Score: {rec.score}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;