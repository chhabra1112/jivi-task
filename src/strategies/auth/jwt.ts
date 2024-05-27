import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseStrategy } from './base';

@Injectable()
export class JwtStrategy extends BaseStrategy {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
  ) {
    super(config);
  }

  async sign(payload: Record<string, any>): Promise<string> {
    return this.jwt.signAsync(payload, {
      ...(this.options.signOptions || {}),
    });
  }

  async verify(token: string): Promise<Record<string, any>> {
    return this.jwt.verifyAsync(token, {
      secret: this.options.secret,
    });
  }
}
