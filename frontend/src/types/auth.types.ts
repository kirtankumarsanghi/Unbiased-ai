// Auth types
export interface User {
  id: string;

  name: string;

  email: string;

  role: string;
}

export interface LoginPayload {
  email: string;

  password: string;
}

export interface AuthResponse {
  access_token: string;

  refresh_token: string;

  user: User;
}