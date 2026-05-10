// Auth service logic
import { authApi } from "../api/auth.api";

import { tokenService } from "./token.service";

export const authService = {
  login: async (
    email: string,
    password: string
  ) => {
    const response =
      await authApi.login({
        email,
        password,
      });

    tokenService.setAccessToken(
      response.access_token
    );

    if (response.refresh_token) {
      tokenService.setRefreshToken(
        response.refresh_token
      );
    }

    return response;
  },

  logout: () => {
    tokenService.clearTokens();

    window.location.href = "/login";
  },
};