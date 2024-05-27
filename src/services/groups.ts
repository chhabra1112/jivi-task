import {
  ExceptionMessages,
  Repositories,
  ResponseMessages,
} from '@app/constants';
import { IGroup, IUser } from '@app/interfaces';
import { GroupModel, UserModel } from '@app/models';
import { GroupRepositoryContract } from '@app/repositories';
import { UserRepositoryContract } from '@app/repositories/user/contract';
import {
  AddGroupMembersDto,
  CreateGroupDto,
  GroupDetailsByIdDto,
  RemoveGroupMemberDto,
} from '@app/validators';
import { ExceptionsHelper } from '@libs/boat';
import { generateUlid } from '@libs/boat/utils/helpers';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
// import { UserRepositoryContract } from '../repositories';

@Injectable()
export class GroupsService {
  constructor(
    @Inject(Repositories.GROUPS_REPO) private groups: GroupRepositoryContract,
  ) {}

  async create(inputs: CreateGroupDto, user: IUser): Promise<string> {
    const group = await this.groups.create({
      id: generateUlid(),
      name: inputs.name,
      userId: user.id,
    });
    await this.groups.attach(group, 'members', user.id);

    return ResponseMessages.GROUP_SUCCESSFULY_CREATED;
  }

  async addMembers(
    inputs: AddGroupMembersDto,
    user: UserModel,
  ): Promise<string> {
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', inputs.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );
    await this.groups.attach(user.groups[0], 'members', inputs.members);

    return ResponseMessages.GROUP_MEMBERS_ADDED;
  }

  async removeMember(
    inputs: RemoveGroupMemberDto,
    user: UserModel,
  ): Promise<string> {
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', inputs.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );
    await user.groups[0]
      .$relatedQuery('members')
      .unrelate()
      .where('id', inputs.memberId);

    return ResponseMessages.GROUP_MEMBER_REMOVED;
  }

  async getMyGroups(user: IUser): Promise<IGroup[]> {
    await user.$load({ groups: true });
    return user.groups;
  }

  async getGroupDetails(
    inputs: GroupDetailsByIdDto,
    user: UserModel,
  ): Promise<IGroup> {
    const group = await this.groups
      .query()
      .where('groups.id', inputs.groupId)
      .withGraphJoined('members')
      .where('members.id', user.id)
      .first();
    ExceptionsHelper.throwIf(
      !group,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );
    return group;
  }
}
