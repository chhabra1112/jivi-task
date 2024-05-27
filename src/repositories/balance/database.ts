import { BalanceModel } from '@app/models';
import { Injectable } from '@nestjs/common';
import { BalanceRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class BalanceRepository
  extends DatabaseRepository<BalanceModel>
  implements BalanceRepositoryContract
{
  @InjectModel(BalanceModel)
  model: BalanceModel;
}
