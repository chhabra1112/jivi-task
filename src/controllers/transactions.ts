import { Request, Response, RestController } from '@libs/boat';
import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDetailTransformer } from '@app/transformer';
import { GroupsService } from '@app/services/groups';
import { Dto, Validate } from '@libs/boat/validator';
import {
  AddGroupMembersDto,
  CreateGroupDto,
  GroupDetailsByIdDto,
  RemoveGroupMemberDto,
} from '@app/validators';
import { AuthGuard } from '@app/guards/auth';
import { UserModel } from '@app/models';
import { TransactionsService } from '@app/services';
import {
  CreateDebtDto,
  CreateSettlementDto,
  DeleteDebtDto,
} from '@app/validators/transactions';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController extends RestController {
  constructor(private service: TransactionsService) {
    super();
  }

  @Validate(CreateDebtDto)
  @Post('debt')
  async createDebt(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: CreateDebtDto,
  ): Promise<Response> {
    const message = await this.service.createDebt(
      inputs,
      req.user as UserModel,
    );
    return res.success({ message });
  }

  @Validate(CreateSettlementDto)
  @Post('settlement')
  async createSettlement(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: CreateSettlementDto,
  ): Promise<Response> {
    const message = await this.service.createNewSettlement(
      inputs,
      req.user as UserModel,
    );
    return res.success({ message });
  }

  @Validate(DeleteDebtDto)
  @Delete(':transactionId')
  async deleteDebt(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: DeleteDebtDto,
  ): Promise<Response> {
    const message = await this.service.deleteTransaction(
      inputs,
      req.user as UserModel,
    );
    return res.success({ message });
  }
}
