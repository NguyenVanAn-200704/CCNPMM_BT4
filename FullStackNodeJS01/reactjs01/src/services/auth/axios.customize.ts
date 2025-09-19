// src/services/auth/axios.customize.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // gốc API backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gắn token từ localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
