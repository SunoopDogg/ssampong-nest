import { RoleInterface } from './role.interface';

export interface UserInterface {
  email: string;
  password: string;
  name: string;
  roles: RoleInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserPayload = Omit<UserInterface, 'password'>;
