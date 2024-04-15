export class UserDto {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: string;
}
