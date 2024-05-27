import { TransactionModel } from '@app/models';
import { Injectable } from '@nestjs/common';
import { TransactionRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class TransactionRepository
  extends DatabaseRepository<TransactionModel>
  implements TransactionRepositoryContract
{
  @InjectModel(TransactionModel)
  model: TransactionModel;
}
