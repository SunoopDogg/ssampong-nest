export interface UserInterface {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  roles: string[];
}
