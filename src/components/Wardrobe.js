// src/components/Wardrobe.js
import React, { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "aws-amplify/auth";

const categories = ["All", "Spectacles", "Shoes", "Accessories", "Upper Wear", "Lower Wear"];

function Wardrobe() {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalItem, setModalItem] = useState(null);
  const [scale, setScale] = useState(1);
  const [userId, setUserId] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        const uid = user.username || user.userId || user.sub;
        setUserId(uid);
        fetchWardrobeItems(uid, "All");
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch wardrobe items from your Lambda → DynamoDB
 const fetchWardrobeItems = async (uid, category) => {
  try {
    const res = await fetch(
      `https://395cq9p5d5.execute-api.us-east-1.amazonaws.com/prod/getWardrobe?userId=${uid}&category=${category}`
    );
    const data = await res.json();
    const parsedBody = JSON.parse(data.body);
    console.log("Parsed wardrobe data:", parsedBody);
    setWardrobeItems(parsedBody.items || []);
  } catch (err) {
    console.error("Error fetching wardrobe items:", err);
  }
};


  // Upload to S3 via presigned URL Lambda
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !userId) return;
    setUploading(true);

    try {
      for (const file of files) {
        const presignRes = await fetch(
          "https://lncgoudxfb.execute-api.us-east-1.amazonaws.com/getPresignedUrl",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              fileName: file.name,
              contentType: file.type,
              category: activeCategory === "All" ? "Uncategorized" : activeCategory,
            }),
          }
        );

        if (!presignRes.ok) throw new Error("Failed to get presigned URL");
        const { uploadUrl } = await presignRes.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("S3 upload failed");
      }

      alert("✅ Upload successful! Outfit will appear soon.");
      setTimeout(() => fetchWardrobeItems(userId, activeCategory), 5000);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Filter items by active category (if not using backend filter)
  const filteredItems =
  activeCategory === "All"
    ? wardrobeItems
    : wardrobeItems.filter(
        (item) =>
          item.category?.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 p-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Your Virtual Wardrobe 👗
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Organize your outfits category-wise — powered by AWS ✨
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeCategory === cat
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-orange-100"
            }`}
            onClick={() => {
              setActiveCategory(cat);
              fetchWardrobeItems(userId, cat);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="flex justify-center mb-10">
        <label className="cursor-pointer bg-white border-2 border-dashed border-orange-300 hover:border-orange-500 transition rounded-2xl shadow-sm p-8 flex flex-col items-center space-y-3 w-full max-w-md">
          <FiUpload className="text-4xl text-orange-500" />
          <span className="text-gray-600 font-medium">
            {uploading ? "Uploading..." : "Click or Drag to Upload Outfits"}
          </span>
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Wardrobe Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.itemID}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              onClick={() => setModalItem(item)}
            >
              <img
  src={item.imageUrl}
  alt={item.ImageName || item.category || "Wardrobe Item"}
  className="w-full h-48 object-cover group-hover:opacity-90 transition"
/>

              <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 cursor-pointer hover:bg-red-100 transition">
                <FiTrash2 className="text-red-500" />
              </div>
              <div className="p-3 text-center text-gray-700 font-medium truncate">
                {item.category}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && !uploading && (
        <div className="text-center mt-16">
          <p className="text-gray-600 font-medium">
            No items in this category yet 👚 <br /> Try uploading something new!
          </p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-2xl z-50"
                onClick={() => setModalItem(null)}
              >
                <FiX />
              </button>
              <motion.img
                src={modalItem.imageUrl}
                alt={modalItem.category}
                className="w-full h-96 object-cover"
                style={{ scale }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                onWheel={(e) => {
                  e.preventDefault();
                  setScale((prev) =>
                    Math.min(Math.max(prev + e.deltaY * -0.0015, 1), 2)
                  );
                }}
                drag
                dragElastic={0.2}
              />
              <div className="p-4 text-center font-semibold text-gray-700">
                {modalItem.category}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Wardrobe;
