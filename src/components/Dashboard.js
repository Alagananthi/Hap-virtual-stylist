// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  FiUpload,
  FiStar,
  FiUsers,
  FiShuffle,
  FiMenu,
  FiX,
  FiHeart,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [userName, setUserName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const getUserName = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name =
          attributes?.name ||
          attributes?.preferred_username ||
          "User";
        setUserName(name);
      } catch (e) {
        console.log("Error fetching user attributes:", e);
        setUserName("User");
      }
    };
    getUserName();
  }, []);

  // Log out user
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  const recommendations = [
    { img: "https://i.imgur.com/5zOZsJR.jpeg", title: "Casual Chic" },
    { img: "https://i.imgur.com/zl7GpKJ.jpeg", title: "Formal Wear" },
    { img: "https://i.imgur.com/2dq2fW3.jpeg", title: "Evening Glam" },
    { img: "https://i.imgur.com/B3UpA6Z.jpeg", title: "Street Style" },
  ];

  const wardrobeCategories = [
    { label: "Dresses 👗", path: "/wardrobe/dresses", count: 12 },
    { label: "Shoes 👠", path: "/wardrobe/shoes", count: 8 },
    { label: "Accessories 💍", path: "/wardrobe/accessories", count: 14 },
    { label: "Bags 👜", path: "/wardrobe/bags", count: 5 },
  ];

  if (!userName) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading your Dashboard...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Header / Hero Section */}
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

      {/* Wardrobe Categories */}
      <div className="px-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Your Wardrobe Sections 👚
        </h2>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {wardrobeCategories.map((item, idx) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={idx}
              className="bg-white rounded-2xl shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(item.path)}
            >
              <p className="font-semibold text-gray-700">{item.label}</p>
              <p className="text-sm text-gray-500">{item.count} items</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outfit Recommendations Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-12 px-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Recommended Looks for You 💅
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommendations.map((rec, idx) => (
            <motion.div
              whileHover={{ scale: 1.08 }}
              key={idx}
              className="min-w-[150px] rounded-2xl bg-white shadow-lg overflow-hidden cursor-pointer"
            >
              <img
                src={rec.img}
                alt={rec.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-2 text-center text-sm font-medium text-gray-700">
                {rec.title}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending Gallery */}
      <div className="mt-16 relative overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Trending Looks ✨
        </h2>
        <div className="overflow-x-scroll scrollbar-hide flex space-x-6 px-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="min-w-[250px] md:min-w-[300px] rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={`https://i.imgur.com/${
                  ["5zOZsJR", "zl7GpKJ", "2dq2fW3", "B3UpA6Z"][i % 4]
                }.jpeg`}
                alt={`Look ${i + 1}`}
                className="w-full h-64 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Link Component
function LinkItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 text-lg text-gray-700 hover:text-orange-500 transition"
    >
      {icon} <span>{label}</span>
    </Link>
  );
}

export default Dashboard;
