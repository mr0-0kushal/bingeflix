import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';
import { RxCross2 } from "react-icons/rx";
import { PiPopcornBold } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' }
};

const HeaderLogin = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({
    message: "",
    flag: ""
  });
  const navigate = useNavigate();

  const logOut = () => {
    setMessage({
      message: "User Logged out",
      flag: "success"
    });
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1000);
  };

  return (
    <div className="absolute top-0 left-0 z-30 bg-transparent sm:flex overflow-hidden w-full sm:p-3">
      <div className="flex flex-row w-full min-h-[60%] relative justify-between items-center pr-4">
        <Link to='/' className='text-lg lg:text-sm font-extrabold p-4 lg:py-4 relative flex flex-row items-baseline justify-start'>
          <span className='bg-transparent backlit-text text-[var(--color-primary)] text-4xl lg:text-5xl'>B</span><span>ingeFlix</span>
        </Link>
        <Navbar />
        
        {/* Mobile Menu Toggle */}
        <div className='relative sm:hidden w-1/2 flex z-41 items-center justify-between'>
        <motion.button
          className="text-white absolute right-0"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
        >
          {open ? <RxCross2 size={40} /> : <PiPopcornBold size={40} />}
        </motion.button>
        </div>

        <button className="button w-auto text-center hidden sm:flex" style={{border: "none", borderRadius:"8px"}}onClick={logOut}>
          LogOut
        </button>
      </div>

      {/* Slide-In Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-0 right-0 w-64 h-full bg-[#121212] p-6 z-40 sm:hidden flex flex-col items-start gap-6 pt-20"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Link to="/main" className="text-white text-lg" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/main" className="text-white text-lg" onClick={() => setOpen(false)}>Browse Movies</Link>
            <Link to="/watchlist" className="text-white text-lg" onClick={() => setOpen(false)}>My Watchlist</Link>
            <Link
              to={user?.role === "admin" ? "/dashboard" : "/profile"}
              className="text-white text-lg"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <button
              className="mt-6 text-white border border-white px-4 py-2 rounded"
              onClick={() => { logOut(); setOpen(false); }}
            >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={message.message} flag={message.flag} />
    </div>
  );
};

export default HeaderLogin;
