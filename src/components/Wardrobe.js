// src/components/Wardrobe.js
import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { uploadData } from 'aws-amplify/storage';
 function Wardrobe() {
 const items = [
    { title: "Upload Spectacles", desc: "3 Spectacles in Wardrobe", category: "Spectacles" },
    { title: "Upload Upper Wears", desc: "11 Upper Wears in Wardrobe", category: "Upperwear" },
    { title: "Upload Watch or Bracelet", desc: "1 Watch or Bracelet in Wardrobe", category: "Accessory" },
    { title: "Upload Lower Wears", desc: "8 Lower Wears in Wardrobe", category: "Lowerwear" },
    { title: "Upload Socks", desc: "6 Socks in Wardrobe", category: "Socks" },
    { title: "Upload Shoes", desc: "12 Shoes in Wardrobe", category: "Shoes" },
  ];
const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('');

  // 3. This function is called when a card is clicked
  const handleCardClick = (category) => {
    setActiveCategory(category);
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Amplify's uploadData will automatically put it in a protected folder for the current user
      const result = await uploadData({
        key: file.name,
        data: file,
        options: {
          level: 'protected', // This is crucial for user-specific storage
          // You can also add metadata
          metadata: { category: activeCategory }
        }
      }).result;
      console.log('Succeeded:', result);
      alert(`${file.name} uploaded successfully! It will appear in your wardrobe shortly.`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset the file input value to allow re-uploading the same file
      event.target.value = null; 
    }
  };
  return (
   <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-6">
      {isUploading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="text-white text-xl">Uploading...</div>
        </div>
      )}
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg,image/jpg"
      />
      <h1 className="text-2xl font-bold text-center mb-6">
       
        Your wardrobe is <span className="text-orange-500">Amazing 😍</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {items.map((item, idx) => (
          <Card key={idx} title={item.title} desc={item.desc} onClick={() => handleCardClick(item.category)} />
        ))}
      </div>
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center hover:scale-105 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <div className="text-blue-500 text-2xl mb-2">
        <FiUpload />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </button>
  );
}

export default Wardrobe;