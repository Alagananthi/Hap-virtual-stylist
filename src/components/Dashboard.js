// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  FiMenu,
  FiUsers,
  FiHeart,
  FiGrid,
  FiUpload,
  FiLogOut,
  FiCloudRain,
  FiSun,
  FiCloud,
  FiAlertCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [userName, setUserName] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const RECOMMEND_API =
    "https://qnvrtcxzdb.execute-api.us-east-1.amazonaws.com/dev/RecommendLambda";

  // 👤 Fetch logged-in user
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

  // 🌤 Fetch weather + recommendations
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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

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

  const SidebarLink = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:text-orange-500 transition-all"
    >
      {icon}
      {sidebarOpen && <span className="text-md font-medium">{label}</span>}
    </Link>
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-400 mb-4"></div>
        Fetching outfit recommendations...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <FiAlertCircle size={48} className="text-red-400 mb-3" />
        <p className="text-center max-w-md">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 font-serif overflow-hidden">
      {/* Sidebar */}
      <motion.div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        animate={{ width: sidebarOpen ? 220 : 80 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-white/70 backdrop-blur-lg shadow-xl flex flex-col py-8 items-center z-40 border-r border-white/40"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: sidebarOpen ? 360 : 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <FiMenu size={26} className="text-orange-500" />
        </motion.div>

        <div className="flex flex-col gap-6 w-full">
          <SidebarLink to="/wardrobe" icon={<FiUpload size={22} />} label="Wardrobe" />
          <SidebarLink to="/profile" icon={<FiUsers size={22} />} label="Profile" />
          <SidebarLink to="/favorites" icon={<FiHeart size={22} />} label="Favorites" />
          <SidebarLink to="/collections" icon={<FiGrid size={22} />} label="Collections" />
        </div>

        <div className="mt-auto mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition"
          >
            <FiLogOut size={22} />
            {sidebarOpen && <span className="text-md font-medium">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Section */}
      <div className="flex-1 ml-[80px] md:ml-[100px] lg:ml-[220px] p-10 transition-all duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-gray-800 tracking-tight"
          >
            Welcome,{" "}
            <span className="bg-gradient-to-r from-orange-500 to-rose-400 bg-clip-text text-transparent">
              {userName} 👋
            </span>
          </motion.h1>

          {weather && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center bg-white/70 backdrop-blur-md px-5 py-2 rounded-full shadow-md"
            >
              <WeatherIcon />
              <p className="ml-3 text-sm text-gray-700">
                {weather.weatherMain} — {weather.tempC}°C
              </p>
            </motion.div>
          )}
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Recommended Outfits for You ✨
          </h2>

          {recommendations.length === 0 ? (
            <p className="text-center text-gray-500">
              No outfit recommendations found.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                >
                  <img
                    src={rec.url}
                    alt={rec.category || "outfit"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center">
                    <p className="font-semibold text-gray-800 text-md">
                      {rec.category || "Outfit"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Labels: {rec.labels?.slice(0, 3).join(", ")}
                    </p>
                    <p className="text-xs text-orange-500 mt-1 font-medium">
                      Weather Fit Score: {rec.score}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
