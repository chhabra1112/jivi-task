import { Injectable } from '@nestjs/common';
import { TransactionModel, TransactionPartyModel } from '@app/models';
import { TransactionPartyType } from '@app/constants';
import { IBalance } from '@app/interfaces';

@Injectable()
export class TransactionBalancesCalculation {
  handle(transactionParties: TransactionPartyModel[]) {
    const borrowersObject = {};
    const lendersObject = {};
    const currency = transactionParties[0].currency;

    for (const party of transactionParties) {
      if (party.type === TransactionPartyType.Borrower) {
        borrowersObject[party.userId] = party.amountInCents;
      } else {
        lendersObject[party.userId] = party.amountInCents;
      }
    }
    this.balanceLenderBorrowings(borrowersObject, lendersObject);
    return this.createBorrowingsList(borrowersObject, lendersObject, currency);
  }

  balanceLenderBorrowings(
    borrowersObject: Record<string, number>,
    lendersObject: Record<string, number>,
  ) {
    for (const lender in lendersObject) {
      if (!(lender in borrowersObject)) {
        continue;
      }
      if (lendersObject[lender] <= borrowersObject[lender]) {
        borrowersObject[lender] -= lendersObject[lender];
        delete lendersObject[lender];
      } else {
        lendersObject[lender] -= borrowersObject[lender];
      }
    }
  }

  createBorrowingsList(
    borrowersObject: Record<string, number>,
    lendersObject: Record<string, number>,
    currency: string,
  ): IBalance[] {
    const borrowings = [];

    for (const borrower in borrowersObject) {
      if (!borrowersObject[borrower]) {
        continue;
      }
      for (const lender in lendersObject) {
        if (!lendersObject[lender]) {
          delete lendersObject[lender];
          continue;
        }
        if (lendersObject[lender] >= borrowersObject[borrower]) {
          lendersObject[lender] -= borrowersObject[borrower];
          borrowings.push({
            currency,
            borrowerId: borrower,
            lenderId: lender,
            amountInCents: borrowersObject[borrower],
          });
          delete borrowersObject[borrower];
          break;
        }

        borrowings.push({
          currency,
          borrowerId: borrower,
          lenderId: lender,
          amountInCents: lendersObject[lender],
        });
        borrowersObject[borrower] -= lendersObject[lender];
        delete lendersObject[lender];
      }
    }
    return borrowings;
  }
}
