// Axios instance setup
import axios from "axios";

import { API } from "../../constants";

export const apiClient = axios.create({
  baseURL: API.BASE_URL,

  timeout: API.TIMEOUT,
  withCredentials: true,
  xsrfCookieName: "csrf_token",
  xsrfHeaderName: "x-csrf-token",

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // AuthProvider handles silent refresh/session recovery.
    }

    return Promise.reject(error);
  }
);
