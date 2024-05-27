import { SettlementModel } from '@app/models';
import { Injectable } from '@nestjs/common';
import { SettlementRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class SettlementRepository
  extends DatabaseRepository<SettlementModel>
  implements SettlementRepositoryContract
{
  @InjectModel(SettlementModel)
  model: SettlementModel;
}
