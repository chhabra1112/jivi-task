import { ExceptionMessages, Repositories } from '@app/constants';
import { BalanceModel, UserModel } from '@app/models';
import { BalanceRepositoryContract } from '@app/repositories';
import { GetGroupBalancesDto } from '@app/validators/balances';
import { ExceptionsHelper } from '@libs/boat';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BalancesService {
  constructor(
    @Inject(Repositories.BALANCES_REPO)
    private balances: BalanceRepositoryContract,
  ) {}

  async getBalancesByGroupId(
    inputs: GetGroupBalancesDto,
    user: UserModel,
  ): Promise<BalanceModel[]> {
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', inputs.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );

    return this.balances.getWhere({ groupId: inputs.groupId });
  }
}
