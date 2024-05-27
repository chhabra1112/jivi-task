import { SettlementModel } from '@app/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface SettlementRepositoryContract
  extends RepositoryContract<SettlementModel> {}
