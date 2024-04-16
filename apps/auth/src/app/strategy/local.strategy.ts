import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AppService } from '../app.service';
import { UserDto } from '../dto/user.dto';

import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private appService: AppService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<UserDto, 'password'>> {
    const user = await this.appService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
