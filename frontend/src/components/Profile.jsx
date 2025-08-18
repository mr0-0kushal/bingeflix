import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserAstronaut } from "react-icons/fa";
import { MdEdit, MdFavorite, MdHistory, MdSubscriptions } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const Profile = () => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const userData = user.data;

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: userData.fullname,
    email: userData.email,
    phone: userData.phone,
    username: userData.username,
    address: userData.address
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData); // sends to backend + refreshes AuthContext user
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!avatarFile) return;
    try {
      const Data = new FormData();
      Data.append("avatar", avatarFile);
      console.log(Data);
      await updateAvatar(Data);
      setIsEditingAvatar(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile:",error)
    }finally{
      setLoading(false);
    }
  };
  // console.log(avatarPreview);

  return (
    <motion.div
      className="w-full p-6 md:p-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10"
        variants={itemVariants}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-md"
          />
          {!isEditingAvatar ? (
            <button
              onClick={() => setIsEditingAvatar(true)}
              className="mt-3 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-black transition"
            >
              Edit Avatar
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAvatarSubmit}
              className="mt-4 flex flex-col items-center space-y-3 w-full"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingAvatar(false);
                    setAvatarPreview(userData?.avatar);
                    setAvatarFile(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          {!isEditing ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800">{userData.fullname}</h2>
              <p className="text-gray-600">Email: {userData.email}</p>
              <p className="text-gray-600">Phone: +91 {userData.phone}</p>
              <p className="text-gray-600">Username: {userData.username}</p>
              <p className="text-gray-600">Address: {userData.address}</p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="mt-4 px-4 py-2 bg-[#F2613F] text-white rounded-lg shadow hover:bg-black transition"
                onClick={() => setIsEditing(true)}
              >
                <MdEdit className="inline mr-2" /> Edit Profile
              </motion.button>
            </>
          ) : (
            <AnimatePresence>
              <motion.form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-black"
              >
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F2613F] outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F2613F] outline-none"
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled
                  placeholder="Username"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F2613F] outline-none"
                />

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-[#F2613F] text-white rounded-lg hover:bg-[#d94f31] transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
      >
        {[
          { icon: <MdHistory />, label: "Watch History", value: "124" },
          { icon: <MdFavorite />, label: "Liked Movies", value: "56" },
          { icon: <MdSubscriptions />, label: "Subscriptions", value: "3" },
          { icon: <FaUserAstronaut />, label: "Followers", value: "890" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center"
          >
            <div className="text-3xl text-[#F2613F] mb-2">{stat.icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {["Movie One", "Movie Two", "Show Three", "Show Four"].map((title, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={`https://picsum.photos/300/200?random=${i + 1}`}
                alt={title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <p className="text-white font-semibold">{title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
