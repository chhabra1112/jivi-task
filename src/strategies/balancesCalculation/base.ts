import { IBalance } from '@app/interfaces';

export abstract class BalanceCalculationStrategy {
  abstract handle(balances: IBalance[], groupId: string);
}
