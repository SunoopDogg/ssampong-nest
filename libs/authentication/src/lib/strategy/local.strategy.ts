import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthenticationAppService } from '../authentication.service';
import { UserDto } from '../dto/user.dto';

import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationAppService: AuthenticationAppService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<UserDto, 'password'>> {
    const user = await this.authenticationAppService.validateUser(
      email,
      password,
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
