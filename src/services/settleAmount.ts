import { ExceptionMessages, Repositories } from '@app/constants';
import { ISettlement, ITransaction } from '@app/interfaces';
import { SettlementModel, TransactionModel, UserModel } from '@app/models';
import {
  BalanceRepositoryContract,
  GroupRepositoryContract,
  SettlementRepositoryContract,
  TransactionRepositoryContract,
} from '@app/repositories';
import { CreateSettlementDto } from '@app/validators/transactions';
import { ExceptionsHelper } from '@libs/boat';
import { generateUlid } from '@libs/boat/utils/helpers';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BalanceCalculationStrategy } from '@app/strategies/balancesCalculation/base';
import { CalculationStrategy } from '@app/strategies/balancesCalculation/constants';

@Injectable()
export class AmountSettlementTask {
  constructor(
    @Inject(Repositories.TRANSACTIONS_REPO)
    private transactions: TransactionRepositoryContract,
    @Inject(Repositories.SETTLEMENTS_REPO)
    private settlements: SettlementRepositoryContract,
    @Inject(Repositories.GROUPS_REPO)
    private groups: GroupRepositoryContract,
    @Inject(CalculationStrategy.DEFAULT)
    private balanceStrategy: BalanceCalculationStrategy,
  ) {}

  async handle(inputs: CreateSettlementDto, user: UserModel): Promise<void> {
    const group = await this.groups.firstWhere({ id: inputs.groupId });
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', inputs.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );

    const transaction = await this.createSettlementTransaction({
      ...inputs,
      userId: user.id,
    });

    const settlement = await this.createSettlement({
      ...inputs,
      transactionId: transaction.id,
    });

    const borrowing = {
      lenderId: settlement.payerId,
      borrowerId: settlement.payeeId,
      amountInCents: transaction.amountInCents,
      currency: transaction.currency,
    };

    await this.balanceStrategy.handle([borrowing], inputs.groupId);
  }

  async createSettlementTransaction(
    payload: ITransaction,
  ): Promise<TransactionModel> {
    return await this.transactions.create({
      id: generateUlid(),
      type: payload.type,
      amountInCents: payload.amountInCents,
      currency: payload.currency,
      paidAt: new Date(),
      userId: payload.userId,
    });
  }

  async createSettlement(payload: ISettlement): Promise<SettlementModel> {
    return await this.settlements.create({
      id: generateUlid(),
      payeeId: payload.payeeId,
      payerId: payload.payerId,
      transactionId: payload.transactionId,
      paymentMode: payload.paymentMode,
    });
  }
}
