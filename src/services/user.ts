import { Repositories } from '@app/constants';
import { IUser } from '@app/interfaces';
import { UserModel } from '@app/models';
import { UserRepositoryContract } from '@app/repositories/user/contract';
import { Injectable, Inject } from '@nestjs/common';
// import { UserRepositoryContract } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories.USER_REPO) private users: UserRepositoryContract,
  ) {}

  async getContacts(user: UserModel) {
    return this.users.query().whereNot('id', user.id);
  }
}
