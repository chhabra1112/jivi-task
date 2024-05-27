import { GroupModel } from '@app/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface GroupRepositoryContract
  extends RepositoryContract<GroupModel> {}
