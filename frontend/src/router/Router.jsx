import React from 'react'
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Auth from '../pages/Authentication/Auth';
import Header from '../components/Header';
import HeaderLogin from '../components/HeaderLogin';
import Footer from '../components/Footer';
import NotFound from '../pages/NotFound';
import Login from '../pages/Authentication/Login';
import SignUp from '../pages/Authentication/SignUp';
import Main from '../pages/Main';
import ProtectedRoute from './ProtectedRoute';
import PublicRoutes from './PublicRoutes';
import Dashboard from '../pages/Dashboard';
import ScreenLoader from '../components/ScreenLoader';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Analytics from '../pages/Admin/Analytics';
import ManageMovies from '../pages/Admin/ManageMovies';
import ManageUsers from '../pages/Admin/ManageUsers';
import Watchlist from '../pages/Watchlist';
import MovieDetails from '../pages/MovieDetails';

const Router = () => {
  const { user, loading } = useAuth();

  // ⏳ Show loader while checking auth
  if (loading) return <ScreenLoader />;

  return (
    <BrowserRouter>
      {user ? <HeaderLogin /> : <Header />}

      <Routes>
        <Route index path="/" element={
          user ? <Navigate to="/main" /> : <Home />
        } />

        <Route path="/auth" element={
          <PublicRoutes><Auth /></PublicRoutes>
        } />

        <Route path="/auth/login" element={
          <PublicRoutes><Login /></PublicRoutes>
        } />

        <Route path="/auth/signup" element={
          <PublicRoutes><SignUp /></PublicRoutes>
        } />

        <Route path="/main" element={
          <ProtectedRoute><Main /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/watchlist" element={
          <ProtectedRoute><Watchlist /></ProtectedRoute>
        } />

        <Route path="/movie/:id" element={
          <ProtectedRoute><MovieDetails /></ProtectedRoute>
        } />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default Router;
