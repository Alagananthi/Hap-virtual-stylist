// src/components/TrialRoom.js
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { FiUpload, FiCamera, FiRefreshCcw } from "react-icons/fi";

// 🧠 Outfit suggestions (non-ML logic)
const getOutfitTip = (selected) => {
  if (!selected) return "Upload or capture your look to get fashion insights ✨";
  const tips = {
    jacket: "Pair your jacket with slim jeans and ankle boots 👢",
    dress: "Add gold accessories and nude heels for a classy touch 💛",
    tshirt: "Try layering with an open shirt or denim jacket 👕",
    saree: "Elegant bangles and pearl earrings elevate this look 🌸",
  };
  return tips[selected] || "Mix and match tones for a balanced aesthetic 👗";
};

// 🧍 3D Image Display Component
function ImagePlane({ imageUrl }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.5, 3.5]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function TrialRoom() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState("");
  const [tip, setTip] = useState(getOutfitTip());
  const [cameraError, setCameraError] = useState(false);
  const [opacity, setOpacity] = useState(0.7);
  const webcamRef = useRef(null);

  useEffect(() => setTip(getOutfitTip(selectedOutfit)), [selectedOutfit]);

  useEffect(() => {
    return () => {
      if (selectedImage?.startsWith("blob:")) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  const handleSnapshot = () => {
    if (webcamRef.current) {
      const imgSrc = webcamRef.current.getScreenshot();
      if (imgSrc) setSelectedImage(imgSrc);
    }
  };

  const resetRoom = () => {
    setSelectedImage(null);
    setSelectedOutfit("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-100 flex flex-col items-center justify-center px-6 py-10">
      {/* 🏷 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center"
      >
        Virtual{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
          Trial Room
        </span>{" "}
        👗
      </motion.h1>

      {/* 📸 Webcam + Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col md:flex-row items-center gap-8 bg-white/70 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 w-full max-w-6xl"
      >
        {/* Left Section */}
        <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-72 h-96 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
            {!cameraError && (
              <Webcam
                ref={webcamRef}
                mirrored
                className="w-full h-full object-cover"
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                onUserMediaError={() => setCameraError(true)}
              />
            )}

            {/* Outfit Overlay */}
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Outfit Overlay"
                className="absolute top-0 left-0 w-full h-full object-contain"
                style={{ opacity }}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-5 flex-wrap justify-center">
            <label className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full cursor-pointer hover:scale-105 transition">
              <FiUpload className="mr-2" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            <button
              onClick={handleSnapshot}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full hover:scale-105 transition"
            >
              <FiCamera className="mr-2" /> Capture
            </button>

            <button
              onClick={resetRoom}
              className="flex items-center px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              <FiRefreshCcw className="mr-2" /> Reset
            </button>
          </div>

          {/* Opacity Control */}
          {selectedImage && (
            <div className="mt-4 w-48 text-center">
              <label className="text-sm text-gray-700">Adjust Outfit Opacity:</label>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-pink-500 mt-1"
              />
            </div>
          )}
        </div>

        {/* Right Section: 3D Preview */}
        <div className="w-full md:w-1/2 h-80 bg-gradient-to-b from-white/60 to-pink-100 rounded-3xl shadow-inner relative overflow-hidden">
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[3, 3, 3]} />
            {selectedImage ? (
              <ImagePlane imageUrl={selectedImage} />
            ) : (
              <mesh>
                <sphereGeometry args={[0.9, 32, 32]} />
                <meshStandardMaterial color="#fde2e4" />
              </mesh>
            )}
            <OrbitControls enableZoom={false} />
          </Canvas>
          <p className="absolute top-2 left-4 text-sm text-gray-500">3D Outfit Preview 🪞</p>
        </div>
      </motion.div>

      {/* 👚 Outfit Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {["dress", "jacket", "tshirt", "saree"].map((item) => (
          <motion.button
            key={item}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedOutfit(item)}
            className={`px-5 py-2 rounded-full border-2 ${
              selectedOutfit === item
                ? "border-pink-500 bg-gradient-to-r from-pink-400 to-orange-300 text-white shadow-md"
                : "border-gray-300 text-gray-700 bg-white"
            } transition`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* 💡 Style Tip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-3xl p-6 text-center border border-pink-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">✨ Style Insight</h2>
        <p className="text-gray-700 text-lg">{tip}</p>
      </motion.div>
    </div>
  );
}
