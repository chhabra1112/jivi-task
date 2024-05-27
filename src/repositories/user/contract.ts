import { UserModel } from '@app/models/user';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserRepositoryContract extends RepositoryContract<UserModel> {}
