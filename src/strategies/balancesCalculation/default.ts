import { Inject, Injectable } from '@nestjs/common';
import { BalanceCalculationStrategy } from './base';
import { Repositories } from '@app/constants';
import { IBalance } from '@app/interfaces';
import { BalanceRepositoryContract } from '@app/repositories';
import { generateUlid } from '@libs/boat/utils/helpers';

@Injectable()
export class DefaultBalanceCalculationStrategy extends BalanceCalculationStrategy {
  constructor(
    @Inject(Repositories.BALANCES_REPO)
    private balances: BalanceRepositoryContract,
  ) {
    super();
  }

  async handle(balances: IBalance[], groupId: string) {
    for (const balance of balances) {
      const currentBorrowing = await this.balances.firstWhere(
        {
          groupId,
          lenderId: balance.lenderId,
          borrowerId: balance.borrowerId,
          currency: balance.currency,
        },
        false,
      );
      if (currentBorrowing) {
        await this.balances.updateWhere(
          {
            id: currentBorrowing.id,
          },
          {
            amountInCents:
              currentBorrowing.amountInCents + balance.amountInCents,
          },
        );
        continue;
      }
      const currentLending = await this.balances.firstWhere(
        {
          groupId,
          lenderId: balance.borrowerId,
          borrowerId: balance.lenderId,
          currency: balance.currency,
        },
        false,
      );
      if (!currentLending) {
        await this.balances.create({
          id: generateUlid(),
          groupId,
          lenderId: balance.lenderId,
          borrowerId: balance.borrowerId,
          currency: balance.currency,
          amountInCents: balance.amountInCents,
        });
        continue;
      }
      if (balance.amountInCents >= currentLending.amountInCents) {
        await this.balances.delete(currentLending);
        balance.amountInCents -= currentLending.amountInCents;
        await this.balances.create({
          id: generateUlid(),
          groupId,
          lenderId: balance.lenderId,
          borrowerId: balance.borrowerId,
          currency: balance.currency,
          amountInCents: balance.amountInCents,
        });
      } else {
        await this.balances.updateWhere(
          {
            id: currentLending.id,
          },
          {
            amountInCents: currentLending.amountInCents - balance.amountInCents,
          },
        );
      }
    }
  }
}
