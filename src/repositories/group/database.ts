import { GroupModel } from '@app/models';
import { Injectable } from '@nestjs/common';
import { GroupRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class GroupRepository
  extends DatabaseRepository<GroupModel>
  implements GroupRepositoryContract
{
  @InjectModel(GroupModel)
  model: GroupModel;
}
