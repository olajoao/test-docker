export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (tokens: Tokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}