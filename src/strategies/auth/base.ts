import { ConfigService } from '@nestjs/config';

export abstract class BaseStrategy {
  protected options: Record<string, any>;
  constructor(config: ConfigService) {
    this.options = config.get('auth');
  }

  abstract sign(payload: Record<string, any>): Promise<string>;

  abstract verify(token: string): Promise<Record<string, any>>;
}
