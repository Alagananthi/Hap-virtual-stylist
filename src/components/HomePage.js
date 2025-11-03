// src/components/HomePage.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";

const heroImages = [
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=2000&q=80",
  //"https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=2000&q=80",
];

const features = [
  {
    title: "AI-Powered Styling",
    desc: "Let artificial intelligence curate perfect outfits that match your vibe, mood, and the weather.",
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80",
  },
  {
    
    title: "Virtual Wardrobe",
    desc: "Upload your clothing pieces and visualize your wardrobe in a stunning, organized interface.",
    img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Personalized Recommendations",
    desc: "Receive daily outfit ideas tailored to your unique sense of style and upcoming occasions.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  },
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 400], [0, 100]);
  const yDecor = useTransform(scrollY, [0, 400], [0, -50]);

  // Check user auth
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

  // Hero auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Apply background gradient (matches SignIn)
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(135deg, #ffe4e6 0%, #ffd6d6 30%, #ffe1cc 100%)"; // pink-peach tone
    document.body.style.fontFamily = "'Playfair Display', serif";
  }, []);

  return (
    <div className="min-h-screen text-gray-900 relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100">
      {/* 🌅 Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
            style={{ y: yHero }}
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100/70 via-rose-100/40 to-orange-100/60" />

        {/* Hero Text */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-serif text-gray-900 tracking-wide leading-tight"
          >
            Redefine Luxury Learning.
          </motion.h1>

          {/* ✨ Gold Underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
            className="h-[3px] mt-4 mx-auto rounded-full"
            style={{
              background: "linear-gradient(90deg, #e7b981 0%, #d6a44b 100%)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="mt-6 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            Discover an experience crafted for achievers — elegant, smooth, and inspired by design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <button
              onClick={() => navigate(user ? "/dashboard" : "/signin")}
              className="mt-10 px-10 py-4 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500"
            >
              {user ? "Go to Dashboard" : "Explore"}
            </button>
          </motion.div>
        </div>

        {/* Decorative Soft Lights */}
        <motion.div
          className="absolute top-16 left-10 w-56 h-56 rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #ffc8dd, #fff0f6)",
            y: yHero,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #ffe1cc, #fff)",
            y: yDecor,
          }}
        />
      </section>

      {/* 🌸 Features Section */}
      <section className="py-28 px-6 bg-gradient-to-b from-pink-100 via-rose-100 to-orange-100">
        <h2 className="text-5xl font-serif text-center mb-16 text-gray-800">
          The Experience ✨
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="rounded-3xl bg-white/70 backdrop-blur-md overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <motion.img
                src={f.img}
                alt={f.title}
                className="w-full h-72 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="p-8 text-center">
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-md">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💎 CTA Section */}
      <section className="py-32 text-center bg-gradient-to-r from-pink-100 via-rose-100 to-orange-100 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-serif text-gray-900 mb-6">
            Elevate Your Style Journey
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            transition={{ duration: 1.2 }}
            className="h-[3px] mx-auto rounded-full mb-8"
            style={{
              background: "linear-gradient(90deg, #f5d78b 0%, #d6a44b 100%)",
            }}
          />

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a new era of elegant learning — where technology meets artistry.  
            <br />
            <span className="text-rose-500 font-semibold">
              Unlock the power of style and innovation.
            </span>
          </p>

          <motion.button
            onClick={() => navigate(user ? "/dashboard" : "/signin")}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="px-12 py-4 text-lg font-bold text-white rounded-full shadow-lg hover:shadow-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-rose-400 hover:to-pink-500 border border-yellow-200"
          >
            {user ? "Continue Your Journey ✨" : "Begin Your Journey ✨"}
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;
