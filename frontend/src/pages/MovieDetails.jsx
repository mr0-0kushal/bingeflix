import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { LOCAL_SERVER } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import ScreenLoader from "../components/ScreenLoader";
import Toast from "../components/Toast";

const MovieDetails = () => {
  const { id } = useParams();
  const {
    addToWatchlist,
    getWatchlistItemByMovie,
    upsertWatchlistItemByMovie
  } = useAuth();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [myRating, setMyRating] = useState("");
  const [myReview, setMyReview] = useState("");
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ message: "", flag: "" });

  const syncMyDraft = (item) => {
    if (!item) {
      setMyRating("");
      setMyReview("");
      setIsWatched(false);
      return;
    }

    setMyRating(item.userRating ?? "");
    setMyReview(item.notes || "");
    setIsWatched(Boolean(item.watched));
  };

  const loadDetails = async () => {
    try {
      setLoading(true);
      const [movieRes, reviewsRes, myItem] = await Promise.all([
        axios.get(`${LOCAL_SERVER}/movie/${id}`),
        axios.get(`${LOCAL_SERVER}/movie/${id}/reviews`),
        getWatchlistItemByMovie(id)
      ]);

      setMovie(movieRes?.data?.data || null);
      setReviews(reviewsRes?.data?.data || []);
      setWatchlistItem(myItem || null);
      syncMyDraft(myItem || null);
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed to load movie details",
        flag: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const refreshMovieAndReviews = async () => {
    const [movieRes, reviewsRes, myItem] = await Promise.all([
      axios.get(`${LOCAL_SERVER}/movie/${id}`),
      axios.get(`${LOCAL_SERVER}/movie/${id}/reviews`),
      getWatchlistItemByMovie(id)
    ]);
    setMovie(movieRes?.data?.data || null);
    setReviews(reviewsRes?.data?.data || []);
    setWatchlistItem(myItem || null);
    syncMyDraft(myItem || null);
  };

  const handleAddToWatchlist = async () => {
    try {
      setSaving(true);
      const item = await addToWatchlist(id);
      setWatchlistItem(item || null);
      syncMyDraft(item || null);
      setMessage({ message: "Added to watchlist", flag: "success" });
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Could not add to watchlist",
        flag: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReview = async () => {
    try {
      setSaving(true);
      await upsertWatchlistItemByMovie(id, {
        watched: isWatched,
        userRating: myRating === "" ? null : Number(myRating),
        notes: myReview
      });
      await refreshMovieAndReviews();
      setMessage({ message: "Rating and review updated", flag: "success" });
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed to save your review",
        flag: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ScreenLoader />;

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 px-6 text-white">
        <p>Movie not found.</p>
        <Link to="/main" className="text-[#F2613F] underline">Back to browse</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-8 lg:px-14 pb-12">
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-[#121212] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
          <div className="w-full h-[430px]">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-[#F2613F]">{movie.title}</h1>
                <p className="text-gray-300 mt-1">
                  {movie.year || "N/A"} | {movie.language || "N/A"} | {movie.runtime || "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-right">
                <p className="text-xs text-gray-400 uppercase">Community Rating</p>
                <p className="text-xl font-black">{movie.averageRating || 0} / 5</p>
                <p className="text-xs text-gray-500">{movie.ratingsCount || 0} ratings</p>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-bold">Story</h2>
              <p className="text-gray-300 mt-2 leading-relaxed">{movie.plot || "No plot available."}</p>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-bold">Cast</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {(movie.cast || []).length ? (
                  movie.cast.map((actor, idx) => (
                    <span key={`${actor}-${idx}`} className="px-3 py-1 rounded-full bg-black border border-white/10 text-sm">
                      {actor}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Cast unavailable</span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-bold">Genres</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {(movie.genre || []).length ? (
                  movie.genre.map((g, idx) => (
                    <span key={`${g}-${idx}`} className="px-3 py-1 rounded-full bg-[#F2613F]/10 border border-[#F2613F]/30 text-sm text-[#F9b39f]">
                      {g}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Genre unavailable</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-[#111] p-5"
        >
          <h3 className="text-2xl font-black text-[#F2613F]">Your Activity</h3>
          <p className="text-sm text-gray-400 mt-1">
            Add this movie to your watchlist, then rate and review it once watched.
          </p>

          {!watchlistItem ? (
            <button
              type="button"
              onClick={handleAddToWatchlist}
              disabled={saving}
              className="mt-4 rounded-lg bg-[#F2613F] px-4 py-2 font-bold hover:opacity-90 transition"
            >
              {saving ? "Adding..." : "Add To Watchlist"}
            </button>
          ) : (
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWatched}
                  onChange={(e) => setIsWatched(e.target.checked)}
                />
                <span className="text-sm">I have watched this movie</span>
              </label>

              <div>
                <label className="text-sm text-gray-300">Your Rating</label>
                <select
                  value={myRating}
                  onChange={(e) => setMyRating(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-black border border-white/20 px-3 py-2 outline-none focus:border-[#F2613F]"
                >
                  <option value="">No rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300">Your Review</label>
                <textarea
                  value={myReview}
                  onChange={(e) => setMyReview(e.target.value)}
                  rows={5}
                  placeholder="Write your review..."
                  className="mt-1 w-full rounded-lg bg-black border border-white/20 px-3 py-2 outline-none focus:border-[#F2613F]"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveReview}
                disabled={saving}
                className="rounded-lg bg-[#F2613F] px-4 py-2 font-bold hover:opacity-90 transition"
              >
                {saving ? "Saving..." : "Save Rating & Review"}
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-[#111] p-5"
        >
          <h3 className="text-2xl font-black text-[#F2613F]">Community Reviews</h3>
          <p className="text-sm text-gray-400 mt-1">See what other viewers think.</p>

          <div className="mt-4 max-h-[450px] overflow-auto pr-1 space-y-3">
            {reviews.length === 0 && (
              <p className="text-gray-400">No reviews yet. Be the first one.</p>
            )}

            {reviews.map((review) => (
              <div key={review._id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">
                    {review?.user?.fullname || review?.user?.username || "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {review.userRating ? `${review.userRating}/5` : "No rating"}
                  </span>
                </div>
                {review.notes ? (
                  <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{review.notes}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">No written review</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Toast message={message.message} flag={message.flag} />
    </div>
  );
};

export default MovieDetails;
