// Axios instance setup
import axios from "axios";

import { API } from "../../constants";

import { STORAGE_KEYS } from "../../constants/storage";
import { tokenService } from "../auth/token.service";

export const apiClient = axios.create({
  baseURL: API.BASE_URL,

  timeout: API.TIMEOUT,

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();

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
      tokenService.clearTokens();
      localStorage.removeItem(STORAGE_KEYS.USER);

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);