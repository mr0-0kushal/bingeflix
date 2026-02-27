import React from 'react';
import { RiSearch2Line } from "react-icons/ri";
import { MdLocalMovies } from "react-icons/md";
import { LuTvMinimalPlay, LuSettings } from "react-icons/lu";
import { FaUserAstronaut } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // ✅ Import Link
import { useAuth } from '../context/AuthContext';

const {user} = useAuth();

const navItems = [
  { icon: <RiSearch2Line />, label: "Search", path: "/" },
  { icon: <MdLocalMovies />, label: "Movies", path: "/" },
  { icon: <LuTvMinimalPlay />, label: "TV Shows", path: "/" },
  { icon: <FaUserAstronaut />, label: "Dashboard", path: (user.role == 'user') ? '/profile' : 'dashboard'  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Navbar = () => {
  return (
    <motion.div
      className="px-6 flex-col justify-center items-center hidden sm:flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex max-w-2xl gap-x-4 sm:gap-x-8">
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.15, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group flex flex-col items-center justify-center cursor-pointer relative"
          >
            {/* ✅ Wrap with Link */}
            <Link to={item.path} className="flex flex-col items-center">
              <motion.div
                className="text-[2rem] sm:text-[2.2rem] text-white transition-all"
                style={{ fontWeight: "bold" }}
              >
                {item.icon}
              </motion.div>
              <motion.span
                className="mt-1 text-xs sm:text-sm text-[#F2613F] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {item.label}
              </motion.span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Navbar;
