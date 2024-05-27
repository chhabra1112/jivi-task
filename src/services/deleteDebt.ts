import { ExceptionMessages, Repositories } from '@app/constants';
import { IBalance } from '@app/interfaces';
import { TransactionModel, UserModel } from '@app/models';
import {
  GroupRepositoryContract,
  TransactionPartyRepositoryContract,
  TransactionRepositoryContract,
} from '@app/repositories';
import { TransactionPartyDto } from '@app/validators/transactions';
import { ExceptionsHelper, ValidationFailed } from '@libs/boat';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionBalancesCalculation } from './balanceCalculation';
import { BalanceCalculationStrategy } from '@app/strategies/balancesCalculation/base';
import { CalculationStrategy } from '@app/strategies/balancesCalculation/constants';

@Injectable()
export class RemoveDebtTask {
  constructor(
    @Inject(Repositories.TRANSACTIONS_REPO)
    private transactions: TransactionRepositoryContract,
    @Inject(Repositories.TRANSACTION_PARTIES_REPO)
    private transactionParties: TransactionPartyRepositoryContract,
    @Inject(Repositories.GROUPS_REPO)
    private groups: GroupRepositoryContract,
    private transactionBalancesCalculator: TransactionBalancesCalculation,
    @Inject(CalculationStrategy.DEFAULT)
    private balanceStrategy: BalanceCalculationStrategy,
  ) {}

  async handle(debt: TransactionModel, user: UserModel): Promise<void> {
    const group = await this.groups.firstWhere({ id: debt.groupId });
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', debt.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.TRANSACTION_NOT_FOUND),
    );

    await debt.$load({ parties: true });
    const transactionBalances = this.transactionBalancesCalculator.handle(
      debt.parties,
    );
    const reversedBalances = this.reverseBorrowings(transactionBalances);
    await this.balanceStrategy.handle(reversedBalances, debt.groupId);

    await this.deleteTransaction(debt);
  }

  reverseBorrowings(balances: IBalance[]): IBalance[] {
    return balances.map((balance) => ({
      ...balance,
      lenderId: balance.borrowerId,
      borrowerId: balance.borrowerId,
    }));
  }

  async deleteTransaction(transaction: TransactionModel) {
    const partyIds = transaction.parties.map((party) => party.id);

    await this.transactionParties.query().delete().whereIn('id', partyIds);

    await this.transactions.deleteWhere({ id: transaction.id });
  }
}
