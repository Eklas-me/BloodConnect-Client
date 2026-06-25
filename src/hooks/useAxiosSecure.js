import { useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useAxiosSecure = () => {
  const { logout } = useAuth();

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    // Request interceptor to attach JWT token to Authorization header
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401/403 — auto logout
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [logout]);

  return axiosSecure;
};

export default useAxiosSecure;
