import {
  ExceptionMessages,
  Repositories,
  ResponseMessages,
  TransactionType,
} from '@app/constants';
import { TransactionModel, UserModel } from '@app/models';
import {
  TransactionPartyRepositoryContract,
  TransactionRepositoryContract,
} from '@app/repositories';
import {
  CreateDebtDto,
  CreateSettlementDto,
  DeleteDebtDto,
  GetGroupTransactionsDto,
} from '@app/validators/transactions';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtTask } from './createDebt';
import { RemoveDebtTask } from './deleteDebt';
import { AmountSettlementTask } from './settleAmount';
import { ExceptionsHelper } from '@libs/boat';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(Repositories.TRANSACTIONS_REPO)
    private transactions: TransactionRepositoryContract,
    private newDebtTask: CreateDebtTask,
    private removeDebtTask: RemoveDebtTask,
    private settleAmount: AmountSettlementTask,
  ) {}

  async createDebt(inputs: CreateDebtDto, user: UserModel): Promise<string> {
    await this.newDebtTask.createNew(inputs, user);

    return ResponseMessages.TRANSACTION_ADDED;
  }

  async deleteTransaction(
    inputs: DeleteDebtDto,
    user: UserModel,
  ): Promise<string> {
    const debt = await this.transactions.firstWhere({
      id: inputs.transactionId,
    });
    if (debt.type == TransactionType.Settlement) {
      throw new NotFoundException('Transaction not found.');
    }
    await this.removeDebtTask.handle(debt, user);

    return ResponseMessages.TRANSACTION_ADDED;
  }

  async createNewSettlement(
    inputs: CreateSettlementDto,
    user: UserModel,
  ): Promise<string> {
    await this.settleAmount.handle(inputs, user);

    return ResponseMessages.AMOUNT_SETTLED;
  }

  async getTransactionsByGroupId(
    inputs: GetGroupTransactionsDto,
    user: UserModel,
  ): Promise<TransactionModel[]> {
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', inputs.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );

    return this.transactions.getWhere({ groupId: inputs.groupId });
  }
}
