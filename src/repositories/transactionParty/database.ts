import { TransactionPartyModel } from '@app/models';
import { Injectable } from '@nestjs/common';
import { TransactionPartyRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class TransactionPartyRepository
  extends DatabaseRepository<TransactionPartyModel>
  implements TransactionPartyRepositoryContract
{
  @InjectModel(TransactionPartyModel)
  model: TransactionPartyModel;
}
