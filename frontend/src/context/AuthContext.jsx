import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { LOCAL_SERVER } from "../utils/constants";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ New state

 useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    setAccessToken(token);
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout().finally(() => setLoading(false)); // Token expired
      } else {
        fetchUser(token).finally(() => setLoading(false)); // Token valid
      }
    } catch (error) {
      logout().finally(() => setLoading(false)); // Invalid token
    }
  } else {
    setLoading(false); // No token, done loading
  }
}, []);


  const fetchUser = async (token) => {
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/fetch-user`,
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("User fetch failed:", err);
    }
  };

  const login = async (dataForm) => {
    const res = await axios.post(`${LOCAL_SERVER}/users/login`, dataForm, { withCredentials: true });
    try {
      const { accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
      await fetchUser(accessToken);
    } catch (error) {
      return error;
    }
    return res;
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn("No token found for logout");
      return false;
    }
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/logout`, {}, {
        withCredentials: true
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });

      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);

      return res.status === 200;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(`${LOCAL_SERVER}/refresh-token`, {}, { withCredentials: true });
      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
      fetchUser(accessToken);
    } catch (err) {
      console.log("Refresh token expired or failed");
      logout();
    }
  };

  const sendOTP = async (formData) => {
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/send-otp`, formData);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (formData) => {
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/verify-otp`, formData, { withCredentials: true });
      const { accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
      await fetchUser(accessToken);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data , token) => {
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/update-user`, data , {withCredentials: true});
      fetchUser(token);
    } catch (error) {
      throw error;
    }
  }

  const updateAvatar = async (data, token) => {
    try {
      const res = await axios.post(`${LOCAL_SERVER}/users/update-avatar`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      fetchUser(token);
    } catch (error) {
      throw error
    }
  }

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
        loading // ✅ Provide loading state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
