// src/components/Wardrobe.js
import React from "react";
import { FiUpload } from "react-icons/fi";
 function Wardrobe() {
  const items = [
    { title: "Upload Spectacles", desc: "3 Spectacles in Wardrobe" },
    { title: "Upload Upper Wears", desc: "11 Upper Wears in Wardrobe" },
    { title: "Upload Watch or Bracelet", desc: "1 Watch or Bracelet in Wardrobe" },
    { title: "Upload Lower Wears", desc: "8 Lower Wears in Wardrobe" },
    { title: "Upload Socks", desc: "6 Socks in Wardrobe" },
    { title: "Upload Shoes", desc: "12 Shoes in Wardrobe" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Your wardrobe is <span className="text-orange-500">Amazing 😍</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {items.map((item, idx) => (
          <Card key={idx} title={item.title} desc={item.desc} />
        ))}
      </div>
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center hover:scale-105 transition cursor-pointer">
      <div className="text-blue-500 text-2xl mb-2">
        <FiUpload />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

export default Wardrobe;