import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { LOCAL_SERVER } from "../utils/constants";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => accessToken || localStorage.getItem("accessToken");
  const getAuthConfig = (extra = {}) => {
    const token = getToken();
    return {
      withCredentials: true,
      ...extra,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(extra.headers || {}),
      },
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout().finally(() => setLoading(false));
        } else {
          fetchUser(token).finally(() => setLoading(false));
        }
      } catch {
        logout().finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token = getToken()) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${LOCAL_SERVER}/users/fetch-user`,
        {},
        getAuthConfig({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      setUser(res.data.data);
    } catch (err) {
      console.error("User fetch failed:", err);
    }
  };

  const login = async (dataForm) => {
    const res = await axios.post(`${LOCAL_SERVER}/users/login`, dataForm, { withCredentials: true });
    const token = res?.data?.data?.accessToken;
    if (!token) {
      throw new Error("Access token missing in login response");
    }
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    await fetchUser(token);
    return res.data.data.user;
  };

  const logout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No token found for logout");
      return false;
    }
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/logout`, {}, getAuthConfig());

      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);

      return res.status === 200;
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        `${LOCAL_SERVER}/users/refresh-token`,
        {},
        { withCredentials: true }
      );
      const token = res?.data?.data?.accessToken || res?.data?.accessToken;
      if (!token) {
        throw new Error("Access token missing in refresh response");
      }
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      fetchUser(token);
    } catch {
      console.log("Refresh token expired or failed");
      logout();
    }
  };

  const sendOTP = async (formData) => {
    const res = await axios.post(`${LOCAL_SERVER}/users/send-otp`, formData);
    return res;
  };

  const verifyOTP = async (formData) => {
    const res = await axios.post(`${LOCAL_SERVER}/users/verify-otp`, formData, { withCredentials: true });
    const token = res?.data?.data?.accessToken;
    if (!token) {
      throw new Error("Access token missing in OTP response");
    }
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    await fetchUser(token);
    return res;
  };

  const updateProfile = async (data) => {
    const token = getToken();
    await axios.post(
      `${LOCAL_SERVER}/users/update-user`,
      data,
      getAuthConfig({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    fetchUser(token);
  };

  const updateAvatar = async (data) => {
    const token = getToken();
    await axios.post(
      `${LOCAL_SERVER}/users/update-avatar`,
      data,
      getAuthConfig({
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    );
    fetchUser(token);
  };

  const getWatchlist = async (params = {}) => {
    const res = await axios.get(
      `${LOCAL_SERVER}/watchlist`,
      getAuthConfig({ params })
    );
    return res?.data?.data;
  };

  const getWatchlistStats = async () => {
    const res = await axios.get(
      `${LOCAL_SERVER}/watchlist/stats`,
      getAuthConfig()
    );
    return res?.data?.data;
  };

  const addToWatchlist = async (movieId) => {
    const res = await axios.post(
      `${LOCAL_SERVER}/watchlist`,
      { movieId },
      getAuthConfig()
    );
    return res?.data?.data;
  };

  const updateWatchlistItem = async (watchlistId, payload) => {
    const res = await axios.patch(
      `${LOCAL_SERVER}/watchlist/${watchlistId}`,
      payload,
      getAuthConfig()
    );
    return res?.data?.data;
  };

  const removeFromWatchlist = async (watchlistId) => {
    const res = await axios.delete(
      `${LOCAL_SERVER}/watchlist/${watchlistId}`,
      getAuthConfig()
    );
    return res?.data?.data;
  };

  const getWatchlistItemByMovie = async (movieId) => {
    const res = await axios.get(
      `${LOCAL_SERVER}/watchlist/movie/${movieId}`,
      getAuthConfig()
    );
    return res?.data?.data;
  };

  const upsertWatchlistItemByMovie = async (movieId, payload = {}) => {
    const res = await axios.patch(
      `${LOCAL_SERVER}/watchlist/movie/${movieId}`,
      payload,
      getAuthConfig()
    );
    return res?.data?.data;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        refreshToken,
        sendOTP,
        verifyOTP,
        updateProfile,
        updateAvatar,
        getWatchlist,
        getWatchlistStats,
        addToWatchlist,
        updateWatchlistItem,
        removeFromWatchlist,
        getWatchlistItemByMovie,
        upsertWatchlistItemByMovie,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
