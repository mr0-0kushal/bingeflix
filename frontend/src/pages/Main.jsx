import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "axios";
import { HeroBg } from "../context/imageData";
import { LOCAL_SERVER } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const Main = () => {
  const { getWatchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  const [groupedMovies, setGroupedMovies] = useState({});
  const [watchlistMap, setWatchlistMap] = useState({});
  const [actionMovieId, setActionMovieId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState(null);
  const [message, setMessage] = useState({ message: "", flag: "" });

  const upsertMovieIntoGroups = (movie) => {
    if (!movie?._id) return;

    setGroupedMovies((prev) => {
      const next = { ...prev };
      const genres = Array.isArray(movie.genre) && movie.genre.length ? movie.genre : ["General"];

      genres.forEach((genre) => {
        const existing = next[genre] || [];
        const index = existing.findIndex((m) => m._id === movie._id);
        if (index === -1) {
          next[genre] = [movie, ...existing];
          return;
        }
        const updated = [...existing];
        updated[index] = { ...updated[index], ...movie };
        next[genre] = updated;
      });

      return next;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, watchlistRes] = await Promise.all([
          axios.get(`${LOCAL_SERVER}/movie`, {
            params: { page: 1, limit: 1000 }
          }),
          getWatchlist({ page: 1, limit: 200, sort: "latest" }),
        ]);

        const movies = moviesRes?.data?.data?.movies || [];
        const genreMap = {};

        movies.forEach((movie) => {
          const genres = Array.isArray(movie.genre) && movie.genre.length ? movie.genre : ["General"];
          genres.forEach((g) => {
            if (!genreMap[g]) genreMap[g] = [];
            genreMap[g].push(movie);
          });
        });

        const map = {};
        (watchlistRes?.items || []).forEach((item) => {
          const movieId = item?.movie?._id || item?.movie;
          if (movieId) {
            map[movieId] = item;
          }
        });

        setGroupedMovies(genreMap);
        setWatchlistMap(map);
      } catch (error) {
        console.error("Error fetching movies/watchlist:", error);
      }
    };

    fetchData();
  }, []);

  const handleWatchlistToggle = async (movieId) => {
    if (!movieId || actionMovieId) return;
    setActionMovieId(movieId);

    try {
      const existing = watchlistMap[movieId];

      if (existing) {
        await removeFromWatchlist(existing._id);
        setWatchlistMap((prev) => {
          const next = { ...prev };
          delete next[movieId];
          return next;
        });
        setMessage({ message: "Removed from watchlist", flag: "success" });
      } else {
        const added = await addToWatchlist(movieId);
        setWatchlistMap((prev) => ({
          ...prev,
          [movieId]: added,
        }));
        setMessage({ message: "Added to watchlist", flag: "success" });
      }
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Could not update watchlist",
        flag: "error",
      });
    } finally {
      setActionMovieId("");
    }
  };

  const handleSearchMovie = async (e) => {
    e.preventDefault();
    if (!searchTitle.trim()) {
      setMessage({ message: "Please enter a movie title", flag: "warning" });
      return;
    }

    try {
      setSearchLoading(true);
      const res = await axios.get(`${LOCAL_SERVER}/movie/search`, {
        params: {
          title: searchTitle.trim(),
          year: searchYear.trim()
        }
      });

      const movie = res?.data?.data;
      setSearchedMovie(movie || null);
      if (movie) {
        upsertMovieIntoGroups(movie);
      }
      setMessage({ message: "Movie found", flag: "success" });
    } catch (error) {
      setSearchedMovie(null);
      setMessage({
        message: error?.response?.data?.message || "Movie not found",
        flag: "error"
      });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <div className="relative z-20 h-full sm:h-screen flex flex-col my-auto justify-center py-30 sm:py-2 px-6 md:px-20">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={HeroBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10 z-10"></div>

        <div className="relative z-20">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold max-w-3xl leading-tight"
          >
            Welcome to <span className="text-[#F2613F]">BingeFlix</span><br /> Build your ultimate watchlist.
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300"
          >
            Search any movie, even if it is not already in database, get details, then add it to watchlist.
          </motion.p>

          <form
            onSubmit={handleSearchMovie}
            className="mt-6 flex flex-col md:flex-row gap-3 max-w-3xl"
          >
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search any movie title..."
              className="flex-1 rounded-lg bg-black/80 border border-white/30 px-4 py-2 outline-none focus:border-[#F2613F]"
            />
            <input
              type="text"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              placeholder="Year (optional)"
              className="w-full md:w-44 rounded-lg bg-black/80 border border-white/30 px-4 py-2 outline-none focus:border-[#F2613F]"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="rounded-lg bg-[#F2613F] text-white px-5 py-2 font-bold hover:opacity-90 transition"
            >
              {searchLoading ? "Searching..." : "Search Movie"}
            </button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <Link
              to="/watchlist"
              className="inline-block rounded-lg bg-[#F2613F] text-white px-5 py-2 font-bold hover:opacity-90 transition"
            >
              Open My Watchlist
            </Link>
          </motion.div>
        </div>
      </div>

      {searchedMovie && (
        <section className="relative z-20 px-6 md:px-20 pb-6">
          <div className="rounded-2xl border border-[#F2613F]/40 bg-[#111]/90 p-4 md:p-5">
            <h2 className="text-2xl font-black text-[#F2613F] mb-3">Search Result</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <img src={searchedMovie.poster} alt={searchedMovie.title} className="w-40 h-56 rounded object-cover" />
              <div className="flex-1">
                <Link to={`/movie/${searchedMovie._id}`} className="text-2xl font-extrabold hover:text-[#F2613F] transition">
                  {searchedMovie.title}
                </Link>
                <p className="text-sm text-gray-300 mt-1">{searchedMovie.year || "N/A"} | {searchedMovie.runtime || "N/A"}</p>
                <p className="text-sm text-gray-300 mt-3 line-clamp-4">{searchedMovie.plot || "No story available."}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleWatchlistToggle(searchedMovie._id)}
                    disabled={actionMovieId === searchedMovie._id}
                    className={`rounded-lg px-4 py-2 font-bold border ${
                      watchlistMap[searchedMovie._id]
                        ? "bg-[#F2613F] border-[#F2613F]"
                        : "bg-black border-white/40"
                    }`}
                  >
                    {actionMovieId === searchedMovie._id
                      ? "..."
                      : watchlistMap[searchedMovie._id]
                      ? "In Watchlist"
                      : "Add To Watchlist"}
                  </button>
                  <Link
                    to={`/movie/${searchedMovie._id}`}
                    className="rounded-lg px-4 py-2 font-bold border border-white/40 bg-black hover:border-[#F2613F] transition"
                  >
                    Open Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="relative z-20 px-6 md:px-20 py-16 space-y-16 bg-black/80">
        {Object.entries(groupedMovies).map(([genre, movies], idx) => (
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
            >
              {movies.map((movie, i) => {
                const isInWatchlist = Boolean(watchlistMap[movie._id]);
                const isActionLoading = actionMovieId === movie._id;

                return (
                  <SwiperSlide key={movie._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="w-auto h-auto rounded-xl m-3 shadow-md overflow-hidden hover:scale-105 transition-all relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleWatchlistToggle(movie._id)}
                        disabled={isActionLoading}
                        className={`absolute top-2 right-2 z-20 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          isInWatchlist
                            ? "bg-[#F2613F] text-white border-[#F2613F]"
                            : "bg-black/60 text-white border-white/40 hover:border-[#F2613F]"
                        }`}
                      >
                        {isActionLoading ? "..." : isInWatchlist ? "In Watchlist" : "+ Watchlist"}
                      </button>

                      <Link
                        to={`/movie/${movie._id}`}
                        className="absolute top-2 left-2 z-20 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white border border-white/40 hover:border-[#F2613F] transition"
                      >
                        Details
                      </Link>

                      <div className="text-center relative flex flex-col w-full h-full rounded-xl text-white items-center justify-center text-sm font-semibold">
                        <Link to={`/movie/${movie._id}`} className="block h-full w-full">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full rounded-xl -z-10 object-cover"
                          />
                        </Link>
                        <div className="p-2 absolute bg-black/70 text-white w-full bottom-0">
                          <Link to={`/movie/${movie._id}`} className="text-sm font-bold hover:text-[#F2613F] transition">
                            {movie.title}
                          </Link>
                          <div className="text-[11px] text-gray-300">
                            {movie.year || "N/A"} | Rating {movie.averageRating || 0} ({movie.ratingsCount || 0})
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ))}
      </div>

      <Toast message={message.message} flag={message.flag} />
    </div>
  );
};

export default Main;
