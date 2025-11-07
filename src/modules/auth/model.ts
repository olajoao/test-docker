export interface LoginProps {
  login: string;
  password: string;
}

export interface AuthProps {
  grant_type: string;
  client_id: number;
  client_secret: string
  username: string
  password: string
  scope: string
}

export interface AuthSuccessProps {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}
