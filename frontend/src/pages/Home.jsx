import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroPoster from '../assets/images/heroPoster.png';
import Swiperr from '../components/Swiperr';
import { cardImagesData } from '../context/imageData';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const childVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center lg:justify-between min-h-screen gap-1 lg:gap-4"
    >
      <Link className='p-4 absolute top-0 right-0 lg:top-2 lg:right-3' to='/auth'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='button text-xs lg:text-md lg:w-[120px]'
        >
          Join Now
        </motion.button>
      </Link>

      {/* Hero Section */}
      <motion.section
        {...fadeUp}
        className="hero flex flex-col items-center justify-between gap-3 p-3 relative overflow-hidden"
      >
        <motion.img
          src={heroPoster}
          alt="Hero Poster"
          className="w-full lg:w-[60%] absolute -z-10 lg:-top-13"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className='w-full h-[60vh] absolute bg-black opacity-[0.6] -z-5 -top-20'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="text-center text-sm lg:text-xl w-[70%] flex flex-col justify-center items-center gap-3"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.3 }}
        >
          <motion.span className='text-2xl lg:text-5xl font-bold text-wrap lg:w-[500px]'>
            Unlimited movies,TV shows, and exclusive
          </motion.span>
          <motion.span className='text-md lg:text-2xl font-semibold text-wrap'>
            Start for just ₹99. Cancel at anytime.
          </motion.span>

          <motion.form
            className='w-full h-full flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-3'
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/auth/signup');
            }}
          >
            <input required type="email" name='email' placeholder='Email address' className='px-5 py-2 lg:w-[25vw] rounded-3xl outline-none border border-[var(--color-primary)]' />
            <motion.button
              type='submit'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button lg:mt-6 cursor-pointer lg:my-3 items-center gap-3 py-2 flex justify-center relative lg:w-[150px]"
            >
              Get Started →
            </motion.button>
          </motion.form>

          <motion.span className='text-wrap w-full'>
            All in one place. Dive into the world of stories that never stop. From epic blockbusters to binge-worthy originals — experience entertainment like never before.
          </motion.span>
        </motion.div>
      </motion.section>

      {/* Latest Releases Section */}
      <motion.section
        className="latest flex flex-col items-center justify-between p-3 mx-auto w-full max-w-6xl gap-y-1 lg:gap-y-9"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        variants={fadeUp}
      >
        <motion.span className="heading text-2xl lg:text-[2.5em] font-bold mb-4 text-white">
          Latest Releases
        </motion.span>
        <motion.div className='w-[80%] h-full flex items-center justify-center'>
          <Swiperr data={cardImagesData} />
        </motion.div>
      </motion.section>

      {/* More Reasons to Join */}
      <motion.section
        className="flex flex-col items-center justify-center p-3 mx-auto w-full h-full"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="heading text-2xl lg:text-[2.5em] font-bold mb-4 text-white"
          variants={fadeUp}
        >
          More Reasons to Join
        </motion.span>

        <div className="grid grid-cols-2 grid-rows-2 place-content-center items-center justify-center gap-8 lg:flex lg:gap-8 lg:flex-row text-xs lg:text-lg">
          {[
            'Cancel or switch plans anytime',
            'Watch on any device',
            'Exclusive content',
            'No ads',
          ].map((text, i) => (
            <motion.div
              key={i}
              className="reasons-card"
              variants={childVariants}
              style={{ willChange: 'transform, opacity' }}
            >
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
