export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  email: string;
  username: string;
  roles: { name: string }[];
}

export interface UserInterface {
  id: string;
  email: string;
  username: string;
  roles: { name: string }[];
}
