import {
  ExceptionMessages,
  Repositories,
  TransactionPartyType,
} from '@app/constants';
import { ITransaction } from '@app/interfaces';
import { TransactionModel, UserModel } from '@app/models';
import {
  GroupRepositoryContract,
  TransactionPartyRepositoryContract,
  TransactionRepositoryContract,
} from '@app/repositories';
import {
  CreateTransactionDto,
  TransactionPartyDto,
} from '@app/validators/transactions';
import { ExceptionsHelper, ValidationFailed } from '@libs/boat';
import { generateUlid } from '@libs/boat/utils/helpers';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionBalancesCalculation } from './balanceCalculation';
import { BalanceCalculationStrategy } from '@app/strategies/balancesCalculation/base';
import { CalculationStrategy } from '@app/strategies/balancesCalculation/constants';

@Injectable()
export class CreateDebtTask {
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

  validateAmountBreakup(parties: TransactionPartyDto[], amount: number) {
    return parties.reduce((a, b) => a + b.amountInCents, 0) === amount;
  }

  breakAmountByPercentages(parties: TransactionPartyDto[], amount: number) {
    if (parties.reduce((a, b) => a + b.percentage, 0) !== 100) {
      throw new ValidationFailed({ borrowers: ['Amounts breakup mismatched'] });
    }
    return parties.map((party) => ({
      userId: party.userId,
      amountInCents: (amount * party.percentage) / 100,
    }));
  }

  breakupAmountByGroupMembers(users: UserModel[], amount: number) {
    const amountLended = amount / users.length;
    return users.map((user) => ({
      userId: user.id,
      amountInCents: amountLended,
    }));
  }

  async createNew(
    inputs: CreateTransactionDto,
    user: UserModel,
  ): Promise<void> {
    const group = await this.groups.firstWhere({ id: inputs.groupId });
    await (user as UserModel)
      .$fetchGraph('groups')
      .where('groups.id', inputs.groupId);
    ExceptionsHelper.throwIf(
      !user.groups?.length,
      new NotFoundException(ExceptionMessages.GROUP_NOT_FOUND),
    );
    if (!this.validateAmountBreakup(inputs.lenders, inputs.amountInCents)) {
      throw new ValidationFailed({ vendors: ['Amounts breakup mismatched'] });
    }

    if (inputs.borrowers?.length) {
      if ('percentage' in inputs.borrowers[0]) {
        inputs.borrowers = this.breakAmountByPercentages(
          inputs.borrowers,
          inputs.amountInCents,
        );
      } else {
        if (
          !this.validateAmountBreakup(inputs.borrowers, inputs.amountInCents)
        ) {
          throw new ValidationFailed({
            borrowers: ['Amounts breakup mismatched'],
          });
        }
      }
    }

    if (!inputs.borrowers?.length) {
      await group.$fetchGraph('members');
      inputs.borrowers = this.breakupAmountByGroupMembers(
        group.members,
        inputs.amountInCents,
      );
    }

    const transaction = await this.createTransaction({
      ...inputs,
      userId: user.id,
    });

    await this.createTransactionParty(
      inputs.borrowers,
      transaction,
      TransactionPartyType.Borrower,
    );
    await this.createTransactionParty(
      inputs.lenders,
      transaction,
      TransactionPartyType.Lender,
    );
    await transaction.$load({ parties: true });
    const transactionBalances = this.transactionBalancesCalculator.handle(
      transaction.parties,
    );

    await this.balanceStrategy.handle(transactionBalances, inputs.groupId);
  }

  async createTransaction(payload: ITransaction): Promise<TransactionModel> {
    return await this.transactions.create({
      id: generateUlid(),
      type: payload.type,
      amountInCents: payload.amountInCents,
      currency: payload.currency,
      name: payload.name,
      description: payload.description,
      paidAt: payload.paidAt ?? new Date(),
      userId: payload.userId,
    });
  }

  async createTransactionParty(
    parties: TransactionPartyDto[],
    transaction: TransactionModel,
    partyType: TransactionPartyType,
  ): Promise<void> {
    for (const party of parties) {
      await this.transactionParties.create({
        id: generateUlid(),
        type: partyType,
        amountInCents: party.amountInCents,
        currency: transaction.currency,
        userId: party.userId,
      });
    }
  }
}
