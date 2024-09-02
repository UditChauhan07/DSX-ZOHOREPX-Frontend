// ProtectedRoute.js
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast"; // Assuming you're using react-toastify for notifications

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return true; // If no expiration time is found, consider it expired
    return new Date().getTime() > expirationTime;
  };

  useEffect(() => {
    if (isTokenExpired()) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      navigate("/");
    }
  }, [navigate]);

  return !isTokenExpired() ? children : null;
};

export default ProtectedRoute;
