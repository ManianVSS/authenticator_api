import axios from "axios";
import { baseURL } from "./baseURL";

export const axiosClient = axios.create({
  baseURL: baseURL + "",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
});

// axiosClient.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   async (err) => {
//     const originalConfig = err.config;
//     if (err.response) {
//       if (err.response.status === 401) {
//         if (window.localStorage.getItem("accessToken")) {
//           localStorage.clear();
//           window.location = window.location.origin + "/login";
//           return Promise.reject(err.response.data);
//         }
//       }
//       if (err.response.status === 403 && err.response.data) {
//         return Promise.reject(err.response.data);
//       }
//     }
//     return Promise.reject(err);
//   }
// );

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axiosClient.post("/auth/jwt/refresh", {
          refresh: refreshToken,
        });
        const { access } = response.data;

        localStorage.setItem("accessToken", access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
        window.location = window.location.origin + "/login";
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);
