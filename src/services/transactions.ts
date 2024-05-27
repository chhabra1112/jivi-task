import {
  Repositories,
  ResponseMessages,
  TransactionType,
} from '@app/constants';
import { UserModel } from '@app/models';
import {
  TransactionPartyRepositoryContract,
  TransactionRepositoryContract,
} from '@app/repositories';
import { CreateTransactionDto } from '@app/validators/transactions';
import { Inject, Injectable } from '@nestjs/common';
import { CreateDebtTask } from './createDebt';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(Repositories.TRANSACTIONS_REPO)
    private transactions: TransactionRepositoryContract,
    @Inject(Repositories.TRANSACTION_PARTIES_REPO)
    private transactionParties: TransactionPartyRepositoryContract,
    private debtTask: CreateDebtTask,
  ) {}

  async createNew(
    inputs: CreateTransactionDto,
    user: UserModel,
  ): Promise<string> {
    if (inputs.type == TransactionType.Loan) {
      await this.debtTask.createNew(inputs, user);
    } else {
    }

    return ResponseMessages.TRANSACTION_ADDED;
  }
}
