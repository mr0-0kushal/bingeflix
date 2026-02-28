import { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_SERVER } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import ScreenLoader from "../../components/ScreenLoader";

const ManageMovies = () => {
  const { accessToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    genre: "",
    runtime: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddBySearch, setShowAddBySearch] = useState(false);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${LOCAL_SERVER}/movie/`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMovies(res?.data?.data?.movies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${LOCAL_SERVER}/movie/${editingId}`,
          formData,
          { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        await axios.post(
          `${LOCAL_SERVER}/movie/create`,
          formData,
          { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ title: "", year: "", genre: "", runtime: "" });
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const addBySearch = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${LOCAL_SERVER}/movie/search`, {
        params: {
          title: formData.title,
          year: formData.year,
        },
      });
      setShowAddBySearch(false);
      setFormData({ title: "", year: "", genre: "", runtime: "" });
      fetchMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (movie) => {
    setFormData(movie);
    setEditingId(movie._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;

    await axios.delete(
      `${LOCAL_SERVER}/movie/${id}`,
      { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } }
    );

    fetchMovies();
  };

  if (loading) return <ScreenLoader />;

  return (
    <div className="manage-movies">
      <h1 className="dashboard-title">Manage Movies</h1>
      <div className="flex gap-2">
        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
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
        {movies.map((movie) => (
          <div key={movie._id} className="movie-row">
            <div>
              <h3>{movie.title}</h3>
              <p>{movie.year} - {movie.runtime}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(movie)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(movie._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <span className="absolute top-[26.4%] right-[36.4%]" onClick={() => setShowModal(false)}>X</span>
          <form className="modal-content" onSubmit={handleSubmit}>
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
              placeholder="Runtime"
              value={formData.runtime}
              onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
            />

            <button type="submit" className="primary-btn">
              {editingId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}

      {showAddBySearch && (
        <div className="modal">
          <span className="absolute top-[26.4%] right-[36.4%]" onClick={() => setShowAddBySearch(false)}>X</span>
          <form className="modal-content" onSubmit={addBySearch}>
            <h2>Add Movie by Search</h2>

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

            <button type="submit" className="primary-btn">
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;
