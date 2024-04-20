import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UserPayload } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';

import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationAppService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserPayload> {
    const user = await this.authenticationAppService.validateUser(
      email,
      password,
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
