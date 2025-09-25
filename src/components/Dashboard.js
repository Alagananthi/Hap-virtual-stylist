// src/components/Dashboard.js
import React from "react";
import { FiUpload, FiStar, FiUsers, FiShuffle } from "react-icons/fi";

 function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Hello, <span className="text-orange-500">Tanmay Mathur 👋</span></h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Card icon={<FiUpload />} title="Upload Dress" desc="13 Clothes Uploaded" />
        <Card icon={<FiShuffle />} title="Try new Combination" desc="26 Combinations Tried" />
        <Card icon={<FiStar />} title="Favourites" desc="104 Dresses Bookmarked" />
        <Card icon={<FiUsers />} title="Edit Character" desc="02 Characters Available" />
      </div>

      <h2 className="mt-6 text-lg font-semibold">Recently Tried 🔥</h2>
      <div className="flex space-x-4 mt-4 overflow-x-scroll">
        {["👕", "👔", "👗", "👚"].map((item, idx) => (
          <div key={idx} className="w-20 h-28 flex items-center justify-center bg-white rounded-xl shadow-md">
            <span className="text-3xl">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center hover:scale-105 transition">
      <div className="text-orange-500 text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
export default Dashboard; 