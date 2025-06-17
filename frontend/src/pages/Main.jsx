import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import axios from 'axios';
import { HeroBg } from '../context/imageData';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { LOCAL_SERVER } from '../utils/constants';

const Home = () => {
  const [groupedVideos, setGroupedVideos] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${LOCAL_SERVER}/videos`);
        const videos = res.data.data.videos;
        // console.log(videos);
        const genreMap = {};
        videos.forEach(video => {
          video.genre.forEach(g => {
            if (!genreMap[g]) genreMap[g] = [];
            genreMap[g].push(video);
          });
        });

        setGroupedVideos(genreMap);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="w-full bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-20 h-full sm:h-screen flex flex-col my-auto justify-center py-30 sm:py-2 px-6 md:px-20">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={HeroBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 bg-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10 z-10"></div>

        <div className="relative z-20">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold max-w-3xl leading-tight"
          >
            Welcome to <span className="text-[#F2613F]">BingeFlix</span><br /> Dive into unlimited entertainment.
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-4 text-lg md:text-xl max-w-xl text-gray-300"
          >
            Discover your next obsession. Stream movies, TV shows, and original content — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-6 flex gap-4"
          >
            <button className="flex items-center gap-2 px-5 py-2 bg-[#F2613F] text-white text-md md:text-lg font-semibold rounded-md hover:bg-[#e25132] transition-all">
              <FaPlay /> Play
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-gray-700/80 text-white text-md md:text-lg font-semibold rounded-md hover:bg-gray-600 transition-all">
              <FaInfoCircle /> More Info
            </button>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Genre Sliders */}
      <div className="relative z-20 px-6 md:px-20 py-16 space-y-16 bg-black/80">
        {Object.entries(groupedVideos).map(([genre, videos], idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold mb-4 text-[#F2613F]">{genre}</h2>
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000 }}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 1.3 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className=''
            >
              {videos.map((video, i) => (
                <SwiperSlide key={video._id}>
                  <motion.div
                    initial={{ opacity: 0, y:10}}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="w-auto h-auto rounded-xl m-3 shadow-md overflow-hidden hover:scale-105 transition-all"
                  >
                    <div className="text-center relative flex flex-col w-full h-full rounded-xl text-white items-center justify-center text-sm font-semibold">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="h-full rounded-xl -z-10"
                    />
                    <div className='hidden p-2 absolute bg-white/60 text-[var(--color-primary)] w-full bottom-0]'>{video.title}</div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
