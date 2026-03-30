import axios from "axios";
import { baseURL } from "./constant";
import store from "@/redux/store";
import { logout } from "@/redux/authSlice";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // cookies send + receive
});

// ---------- Add token automatically ----------
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ---------- Auto logout if token expired ----------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("persist:root");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
