import {
  ExceptionMessages,
  Repositories,
  UserStatusEnum,
} from '@app/constants';
import { UserModel } from '@app/models/user';
import { UserRepositoryContract } from '@app/repositories/user/contract';
import { JwtStrategy } from '@app/strategies/auth/jwt';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public reflector: Reflector,
    @Inject(Repositories.USER_REPO) private userRepo: UserRepositoryContract,
    private jwtStrategy: JwtStrategy,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return this.handle(context);
  }

  async handle(context: ExecutionContext): Promise<boolean> {
    console.log('Auth guard running...');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ExceptionMessages.AUTHXO1);
    }

    try {
      let user = (await this.verifyTokenAndReturnUser(token)) as UserModel;
      if (!user) {
        throw new Error(ExceptionMessages.AUTHXO1);
      }
      if (user.status === UserStatusEnum.UNAPPROVED) {
        throw new Error(ExceptionMessages.AUTHX04);
      }
      request.user = await this.verifyTokenAndReturnUser(token);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Record<string, any>,
  ): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async verifyTokenAndReturnUser(token: string): Promise<Record<string, any>> {
    const payload = await this.jwtStrategy.verify(token);
    return await this.getUserFromSub(payload.sub);
  }

  async getUserFromSub(sub: string): Promise<Record<string, any>> {
    return await this.userRepo.firstWhere({ id: sub });
  }
}
