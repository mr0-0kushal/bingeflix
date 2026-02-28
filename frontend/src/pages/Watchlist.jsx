import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ScreenLoader from "../components/ScreenLoader";
import Toast from "../components/Toast";

const Watchlist = () => {
  const { getWatchlist, updateWatchlistItem, removeFromWatchlist } = useAuth();

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    watched: 0,
    pending: 0,
    ratedCount: 0,
    avgUserRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [savingItemId, setSavingItemId] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [notesDraft, setNotesDraft] = useState({});
  const [message, setMessage] = useState({ message: "", flag: "" });

  const [filters, setFilters] = useState({
    search: "",
    watched: "all",
    sort: "latest",
  });

  const summaryCards = useMemo(
    () => [
      { label: "Total", value: summary.total },
      { label: "Watched", value: summary.watched },
      { label: "Pending", value: summary.pending },
      { label: "Avg Rating", value: summary.avgUserRating || 0 },
    ],
    [summary]
  );

  const fetchWatchlist = async (targetPage = 1) => {
    try {
      setLoading(true);
      const params = {
        page: targetPage,
        limit: 12,
        sort: filters.sort,
      };

      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.watched !== "all") {
        params.watched = filters.watched === "watched";
      }

      const data = await getWatchlist(params);
      const fetchedItems = data?.items || [];

      setItems(fetchedItems);
      setSummary(data?.summary || {
        total: 0,
        watched: 0,
        pending: 0,
        ratedCount: 0,
        avgUserRating: 0,
      });
      setPage(data?.page || targetPage);
      setPages(data?.pages || 0);

      const initialNotes = {};
      fetchedItems.forEach((item) => {
        initialNotes[item._id] = item?.notes || "";
      });
      setNotesDraft(initialNotes);
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed to load watchlist",
        flag: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist(page);
  }, [page, filters.search, filters.sort, filters.watched]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
    }));
  };

  const handleToggleWatched = async (item) => {
    try {
      setSavingItemId(item._id);
      await updateWatchlistItem(item._id, { watched: !item.watched });
      setMessage({
        message: !item.watched ? "Marked as watched" : "Moved to pending",
        flag: "success",
      });
      await fetchWatchlist(page);
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed updating status",
        flag: "error",
      });
    } finally {
      setSavingItemId("");
    }
  };

  const handleRatingUpdate = async (itemId, value) => {
    try {
      setSavingItemId(itemId);
      await updateWatchlistItem(itemId, { userRating: value ? Number(value) : null });
      setMessage({ message: "Rating updated", flag: "success" });
      await fetchWatchlist(page);
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed updating rating",
        flag: "error",
      });
    } finally {
      setSavingItemId("");
    }
  };

  const handleSaveNotes = async (itemId) => {
    try {
      setSavingItemId(itemId);
      await updateWatchlistItem(itemId, { notes: notesDraft[itemId] || "" });
      setMessage({ message: "Notes saved", flag: "success" });
      await fetchWatchlist(page);
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed saving notes",
        flag: "error",
      });
    } finally {
      setSavingItemId("");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setSavingItemId(itemId);
      await removeFromWatchlist(itemId);
      setMessage({ message: "Removed from watchlist", flag: "success" });

      if (items.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchWatchlist(page);
      }
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Failed removing item",
        flag: "error",
      });
    } finally {
      setSavingItemId("");
    }
  };

  if (loading) return <ScreenLoader />;

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 md:px-8 lg:px-14 pt-24 pb-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#1f1f1f] via-[#151515] to-[#0f0f0f] p-6 md:p-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F2613F]">My Watchlist</h1>
        <p className="text-gray-300 mt-2 max-w-3xl">
          Manage everything in one place: pending picks, watched titles, personal ratings, and notes for what to watch next.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-xl bg-black/40 border border-white/10 p-4">
              <p className="text-xs uppercase text-gray-400 tracking-wider">{card.label}</p>
              <p className="text-2xl font-black mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#111]/80 p-4 md:p-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by movie title..."
            className="flex-1 rounded-lg bg-black border border-white/20 px-4 py-2 outline-none focus:border-[#F2613F]"
          />
          <select
            value={filters.watched}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, watched: e.target.value }));
            }}
            className="rounded-lg bg-black border border-white/20 px-3 py-2 outline-none focus:border-[#F2613F]"
          >
            <option value="all">All</option>
            <option value="watched">Watched</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filters.sort}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, sort: e.target.value }));
            }}
            className="rounded-lg bg-black border border-white/20 px-3 py-2 outline-none focus:border-[#F2613F]"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top Rated</option>
          </select>
          <button type="submit" className="rounded-lg bg-[#F2613F] px-4 py-2 font-bold hover:opacity-90 transition">
            Apply
          </button>
        </form>
      </section>

      {items.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-dashed border-white/20 p-10 text-center">
          <h2 className="text-2xl font-extrabold text-[#F2613F]">Watchlist is empty</h2>
          <p className="text-gray-300 mt-2">Start adding movies from browse to build your perfect queue.</p>
          <Link to="/main" className="inline-block mt-5 rounded-lg bg-[#F2613F] px-5 py-2 font-bold hover:opacity-90 transition">
            Browse Movies
          </Link>
        </section>
      ) : (
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {items.map((item, index) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-44 h-60 sm:h-auto">
                  <img
                    src={item?.movie?.poster}
                    alt={item?.movie?.title || "Poster"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/movie/${item?.movie?._id}`} className="text-xl font-extrabold text-white hover:text-[#F2613F] transition">
                        {item?.movie?.title}
                      </Link>
                      <p className="text-sm text-gray-400">
                        {item?.movie?.year || "N/A"} | {item?.movie?.runtime || "N/A"}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${item.watched ? "border-green-500 text-green-300" : "border-yellow-500 text-yellow-300"}`}>
                      {item.watched ? "Watched" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={savingItemId === item._id}
                      onClick={() => handleToggleWatched(item)}
                      className="rounded-lg border border-white/20 px-3 py-2 text-sm font-bold hover:border-[#F2613F] transition"
                    >
                      {savingItemId === item._id ? "Updating..." : item.watched ? "Mark Pending" : "Mark Watched"}
                    </button>

                    <select
                      value={item.userRating || ""}
                      disabled={savingItemId === item._id}
                      onChange={(e) => handleRatingUpdate(item._id, e.target.value)}
                      className="rounded-lg bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#F2613F]"
                    >
                      <option value="">No Personal Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={notesDraft[item._id] || ""}
                      onChange={(e) =>
                        setNotesDraft((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      placeholder="Add private notes..."
                      rows={3}
                      className="w-full rounded-lg bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#F2613F]"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={savingItemId === item._id}
                        onClick={() => handleSaveNotes(item._id)}
                        className="rounded-lg bg-[#F2613F] px-4 py-2 text-sm font-bold hover:opacity-90 transition"
                      >
                        Save Notes
                      </button>
                      <button
                        type="button"
                        disabled={savingItemId === item._id}
                        onClick={() => handleRemove(item._id)}
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-950/40 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      )}

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded border border-white/20 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-300">Page {page} of {pages}</span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            className="px-3 py-1 rounded border border-white/20 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <Toast message={message.message} flag={message.flag} />
    </div>
  );
};

export default Watchlist;
