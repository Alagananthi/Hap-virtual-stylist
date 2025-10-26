// src/components/HomePage.js
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";

// Features
const features = [
  {
    img: "https://i.imgur.com/5zOZsJR.jpeg",
    title: "Upload Your Clothes",
    desc: "Easily add your wardrobe to the cloud and manage all your outfits in one place.",
  },
  {
    img: "https://i.imgur.com/zl7GpKJ.jpeg",
    title: "Smart Outfit Suggestions",
    desc: "Our AI suggests the best combos based on style and weather.",
  },
  {
    img: "https://i.imgur.com/2dq2fW3.jpeg",
    title: "Virtual Trial Room",
    desc: "Try outfits virtually before wearing them in real life.",
  },
  {
    img: "https://i.imgur.com/B3UpA6Z.jpeg",
    title: "Weather-Aware Styling",
    desc: "Get recommendations tailored to today's weather in your location.",
  },
];

// Weather-based outfit suggestions
const weatherOutfits = {
  Clear: { img: "https://i.imgur.com/8zOZsJR.jpeg", text: "Light and breezy outfits for sunny days!" },
  Rain: { img: "https://i.imgur.com/zl8GpKJ.jpeg", text: "Don’t forget your raincoat & boots!" },
  Snow: { img: "https://i.imgur.com/2dq5fW3.jpeg", text: "Stay warm with cozy layers!" },
  Clouds: { img: "https://i.imgur.com/B3UqA6Z.jpeg", text: "Casual outfits for cloudy weather." },
};

// Outfit gallery images
const outfitImages = [
  "https://i.imgur.com/5zOZsJR.jpeg",
  "https://i.imgur.com/zl7GpKJ.jpeg",
  "https://i.imgur.com/2dq2fW3.jpeg",
  "https://i.imgur.com/B3UpA6Z.jpeg",
];

// Map Open-Meteo weather codes to categories
const mapWeatherCode = (code) => {
  if ([0].includes(code)) return "Clear";
  if ([1, 2, 3].includes(code)) return "Clouds";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  return "Clear";
};

function HomePage() {
  const [weather, setWeather] = useState("Clear");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Detect logged-in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // Weather detection using Open-Meteo
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await res.json();
        const code = data?.current_weather?.weathercode;
        setWeather(mapWeatherCode(code));
      } catch (err) {
        console.error("Weather API error:", err);
      }
    });
  }, []);

  // Scroll animation for outfit gallery
  const scrollRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100">

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center py-28 px-6 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200">
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
        >
          Virtual Stylist 👗☁️
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gray-700 max-w-3xl mb-8 text-lg md:text-xl"
        >
          Upload your wardrobe, explore outfit combinations, and get personalized suggestions — all powered by cloud storage and AI styling!
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-lg hover:bg-pink-600 transition"
            >
              Sign In to Continue
            </button>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
          Features You'll Love ✨
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col items-center text-center p-4"
            >
              <img src={feature.img} alt={feature.title} className="w-full h-44 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outfit Gallery with Scroll & Zoom */}
      <div className="py-16 px-6 bg-gradient-to-r from-orange-50 to-pink-50">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Explore Looks 💃
        </h2>
        <div className="overflow-x-scroll scrollbar-hide" ref={scrollRef}>
          <div className="flex space-x-6 px-6">
            {outfitImages.map((img, idx) => (
              <motion.div
                key={idx}
                style={{ scale }}
                whileHover={{ scale: 1.08 }}
                className="min-w-[250px] md:min-w-[300px] rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              >
                <img src={img} alt={`Outfit ${idx + 1}`} className="w-full h-64 object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather-Based Outfit Suggestions */}
      {weather && weatherOutfits[weather] && (
        <div className="py-16 px-6 bg-gradient-to-r from-pink-50 to-orange-50 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Today's Outfit Suggestion 🌤️</h2>
          <motion.div whileHover={{ scale: 1.03 }} className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={weatherOutfits[weather].img} alt="Weather Outfit" className="w-full h-64 object-cover" />
            <div className="p-4 text-gray-700 font-medium">{weatherOutfits[weather].text}</div>
          </motion.div>
        </div>
      )}

      {/* AWS Cloud Info Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-orange-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powered by AWS Cloud ☁️</h2>
          <p className="text-gray-600 text-lg md:text-xl">
            All your wardrobe data is securely stored in AWS S3, allowing real-time outfit recommendations and seamless access across your devices.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Upgrade Your Style? 💃</h2>
        {user ? (
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/signin"
            className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-lg hover:bg-pink-600 transition"
          >
            Sign In to Start
          </Link>
        )}
      </div>
    </div>
  );
}

export default HomePage;
