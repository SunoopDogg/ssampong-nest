export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  email: string;
  username: string;
  roles: string[];
}