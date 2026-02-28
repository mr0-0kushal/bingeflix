import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LOCAL_SERVER } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import ScreenLoader from "../../components/ScreenLoader";
import Toast from "../../components/Toast";

const initialForm = {
  title: "",
  year: "",
  genre: "",
  cast: "",
  plot: "",
  language: "",
  runtime: "",
  poster: ""
};

const toCommaSeparated = (value) => {
  if (!Array.isArray(value)) return value || "";
  return value.join(", ");
};

const ManageMovies = () => {
  const { accessToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [limit, setLimit] = useState(10);
  const [formData, setFormData] = useState(initialForm);
  const [posterImage, setPosterImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddBySearch, setShowAddBySearch] = useState(false);
  const [searchForm, setSearchForm] = useState({ title: "", year: "" });
  const [message, setMessage] = useState({ message: "", flag: "" });
  const [saving, setSaving] = useState(false);

  const posterPreview = useMemo(() => {
    if (posterImage) {
      return URL.createObjectURL(posterImage);
    }
    return formData.poster || "";
  }, [posterImage, formData.poster]);

  const authConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${accessToken}` }
  };

  const fetchMovies = async (targetPage = page, targetLimit = limit, options = {}) => {
    const { showPageLoader = false } = options;

    if (showPageLoader) {
      setPageLoading(true);
    }

    try {
      const res = await axios.get(`${LOCAL_SERVER}/movie/`, {
        ...authConfig,
        params: { page: targetPage, limit: targetLimit }
      });
      const data = res?.data?.data || {};
      setMovies(data.movies || []);
      setPages(data.pages || 0);
      setTotalMovies(data.total || 0);
    } catch (err) {
      console.error(err);
      setMessage({ message: "Failed to fetch movies", flag: "error" });
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page, limit, { showPageLoader: !loading });
  }, [page, limit]);

  useEffect(() => {
    return () => {
      if (posterImage) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [posterImage, posterPreview]);

  const resetForm = () => {
    setFormData(initialForm);
    setPosterImage(null);
    setEditingId(null);
  };

  const buildMovieFormData = () => {
    const payload = new FormData();
    payload.append("title", formData.title || "");
    payload.append("year", formData.year || "");
    payload.append("genre", formData.genre || "");
    payload.append("cast", formData.cast || "");
    payload.append("plot", formData.plot || "");
    payload.append("language", formData.language || "");
    payload.append("runtime", formData.runtime || "");
    payload.append("poster", formData.poster || "");
    if (posterImage) {
      payload.append("posterImage", posterImage);
    }
    return payload;
  };

  const refreshAfterMutation = async () => {
    if (page !== 1) {
      setPage(1);
      return;
    }
    await fetchMovies(1, limit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = buildMovieFormData();
      const config = {
        ...authConfig,
        headers: {
          ...authConfig.headers,
          "Content-Type": "multipart/form-data"
        }
      };

      if (editingId) {
        await axios.put(`${LOCAL_SERVER}/movie/${editingId}`, payload, config);
        setMessage({ message: "Movie updated", flag: "success" });
      } else {
        await axios.post(`${LOCAL_SERVER}/movie/create`, payload, config);
        setMessage({ message: "Movie created", flag: "success" });
      }

      setShowModal(false);
      resetForm();
      await refreshAfterMutation();
    } catch (err) {
      console.error(err);
      setMessage({
        message: err?.response?.data?.message || "Failed to save movie",
        flag: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const addBySearch = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.get(`${LOCAL_SERVER}/movie/search`, {
        params: {
          title: searchForm.title,
          year: searchForm.year
        }
      });
      setShowAddBySearch(false);
      setSearchForm({ title: "", year: "" });
      setMessage({ message: "Movie added from search", flag: "success" });
      await refreshAfterMutation();
    } catch (error) {
      console.error(error);
      setMessage({
        message: error?.response?.data?.message || "Search add failed",
        flag: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (movie) => {
    setFormData({
      title: movie.title || "",
      year: movie.year || "",
      genre: toCommaSeparated(movie.genre),
      cast: toCommaSeparated(movie.cast),
      plot: movie.plot || "",
      language: movie.language || "",
      runtime: movie.runtime || "",
      poster: movie.poster || ""
    });
    setPosterImage(null);
    setEditingId(movie._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;

    try {
      await axios.delete(`${LOCAL_SERVER}/movie/${id}`, authConfig);
      setMessage({ message: "Movie deleted", flag: "success" });
      if (movies.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchMovies(page, limit, { showPageLoader: true });
      }
    } catch (error) {
      setMessage({
        message: error?.response?.data?.message || "Delete failed",
        flag: "error"
      });
    }
  };

  if (loading) return <ScreenLoader />;

  return (
    <div className="manage-movies">
      <h1 className="dashboard-title">Manage Movies</h1>
      <div className="flex gap-2">
        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Movie
        </button>
        <button
          className="primary-btn"
          onClick={() => setShowAddBySearch(true)}
        >
          + Add Movie by Search
        </button>
      </div>

      <div className="movie-table">
        {movies.length === 0 ? (
          <div className="movie-row">
            <p>No movies found.</p>
          </div>
        ) : (
          movies.map((movie) => (
            <div key={movie._id} className="movie-row">
              <div className="flex items-center gap-3">
                <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                <div>
                  <h3>{movie.title}</h3>
                  <p>{movie.year} - {movie.runtime}</p>
                </div>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(movie)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(movie._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-300">
          Total: {totalMovies} | Page {page} of {pages || 1}
        </p>

        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="rounded-md bg-black border border-white/20 px-2 py-1 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={30}>30 / page</option>
          </select>

          <button
            type="button"
            className="primary-btn !mb-0 !px-3 !py-1"
            disabled={page <= 1 || pageLoading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>

          <button
            type="button"
            className="primary-btn !mb-0 !px-3 !py-1"
            disabled={page >= pages || pages === 0 || pageLoading}
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <form className="modal-content max-h-[90vh] overflow-auto" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Movie" : "Add Movie"}</h2>

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />

            <input
              type="text"
              placeholder="Genre (comma separated)"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />

            <input
              type="text"
              placeholder="Cast (comma separated)"
              value={formData.cast}
              onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
            />

            <textarea
              placeholder="Story / Plot"
              value={formData.plot}
              rows={4}
              onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
            />

            <input
              type="text"
              placeholder="Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            />

            <input
              type="text"
              placeholder="Runtime (e.g. 120 min)"
              value={formData.runtime}
              onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
            />

            <input
              type="text"
              placeholder="Poster URL (optional)"
              value={formData.poster}
              onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterImage(e.target.files?.[0] || null)}
            />

            {posterPreview && (
              <img src={posterPreview} alt="Poster preview" className="w-24 h-32 object-cover rounded" />
            )}

            <div className="flex gap-2">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddBySearch && (
        <div className="modal">
          <form className="modal-content" onSubmit={addBySearch}>
            <h2>Add Movie by Search</h2>
            <input
              type="text"
              placeholder="Title"
              value={searchForm.title}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Year"
              value={searchForm.year}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, year: e.target.value }))}
            />
            <div className="flex gap-2">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Searching..." : "Search & Add"}
              </button>
              <button type="button" className="primary-btn" onClick={() => setShowAddBySearch(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <Toast message={message.message} flag={message.flag} />
    </div>
  );
};

export default ManageMovies;
