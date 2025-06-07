import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import google from '/google.png';

function Auth() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="auth-container flex flex-col items-center justify-center h-full w-full"
    >
      {/* Heading */}
      <motion.span
        className="heading text-2xl lg:text-3xl font-extrabold mb-6"
        variants={fadeUp}
      >
        Authentication
      </motion.span>

      {/* Auth Buttons */}
      <motion.div
        className="auth-buttons flex gap-5 lg:justify-center w-full justify-center items-center lg:w-[40%] mb-8"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <Link to="/auth/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="button_special"
          >
            <span className="button_lg">
              <span className="button_sl"></span>
              <span className='button_text font-bold'>Login</span>
            </span>
          </motion.button>
        </Link>

        <Link to="/auth/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="button_special"
          >
            <span className="button_lg">
              <span className="button_sl"></span>
              <span className='button_text font-bold'>SignUp</span>
            </span>
          </motion.button>
        </Link>
      </motion.div>

      {/* OAuth Heading */}
      <motion.span
        className="heading text-2xl lg:text-3xl font-extrabold mb-4"
        variants={fadeUp}
        transition={{ delay: 0.3 }}
      >
        OAuth
      </motion.span>

      {/* OAuth Buttons */}
      <motion.div
        className="flex flex-col lg:flex-row items-center lg:gap-5 lg:justify-between lg:w-[40%]"
        variants={fadeUp}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          className="button_2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Signin with</span>&nbsp;
          <span className='relative'>Google</span>
        </motion.button>

        <motion.div
          className="button_2 text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Signin with</span>&nbsp;
          <span>Facebook</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Auth;
