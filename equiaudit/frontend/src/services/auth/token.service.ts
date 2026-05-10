// Token service logic
import { STORAGE_KEYS } from "../../constants/storage";

export const tokenService = {
  getAccessToken: () =>
    localStorage.getItem(
      STORAGE_KEYS.ACCESS_TOKEN
    ),

  setAccessToken: (token: string) =>
    localStorage.setItem(
      STORAGE_KEYS.ACCESS_TOKEN,
      token
    ),

  removeAccessToken: () =>
    localStorage.removeItem(
      STORAGE_KEYS.ACCESS_TOKEN
    ),

  getRefreshToken: () =>
    localStorage.getItem(
      STORAGE_KEYS.REFRESH_TOKEN
    ),

  setRefreshToken: (
    token: string
  ) =>
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      token
    ),

  clearTokens: () => {
    localStorage.removeItem(
      STORAGE_KEYS.ACCESS_TOKEN
    );

    localStorage.removeItem(
      STORAGE_KEYS.REFRESH_TOKEN
    );
  },
};