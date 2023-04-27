import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID:
        '6745985230-s5pficrsoaooet1jed2g6rhd9iqfnvv3.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8001/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    done(null, profile);
  }
}
