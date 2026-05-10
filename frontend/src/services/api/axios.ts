// Axios instance setup
import axios from "axios";

import { API } from "../../constants";

import { STORAGE_KEYS } from "../../constants/storage";

export const apiClient = axios.create({
  baseURL: API.BASE_URL,

  timeout: API.TIMEOUT,

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      STORAGE_KEYS.ACCESS_TOKEN
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);