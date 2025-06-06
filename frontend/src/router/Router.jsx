import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Authentication/Auth';
import Header from '../components/Header';
import HeaderLogin from '../components/HeaderLogin'
import Footer from '../components/Footer';
import NotFound from '../pages/NotFound';
import Login from '../pages/Authentication/Login';
import SignUp from '../pages/Authentication/SignUp';
import Main from '../pages/Main';
import ProtectedRoute from './ProtectedRoute';
import PublicRoutes from './PublicRoutes';
import Dashboard from '../pages/Dashboard';


const Router = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      {user ? <HeaderLogin /> : <Header />}
      <Routes>
        <Route index path="/" element={
          user ? <Navigate to="/main" /> : <Home />
        } />
        <Route
          path="/auth"
          element={
            <PublicRoutes>
              <Auth />
            </PublicRoutes>
          }
        />
        <Route
          path="/auth/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <PublicRoutes>
              <SignUp />
            </PublicRoutes>
          }
        />
        <Route path="/main" element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>

  )
}

export default Router
