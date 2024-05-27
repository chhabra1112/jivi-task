import { Repositories } from '@app/constants';
import { UserRepositoryContract } from '@app/repositories/user/contract';
import { Injectable, Inject } from '@nestjs/common';
// import { UserRepositoryContract } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories.USER_REPO) private users: UserRepositoryContract,
  ) {}
}
