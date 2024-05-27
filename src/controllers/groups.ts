import { Request, Response, RestController } from '@libs/boat';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
import { GetGroupTransactionsDto } from '@app/validators/transactions';
import { GetGroupBalancesDto } from '@app/validators/balances';
import { BalancesService } from '@app/services/balances';
import { TransactionsService } from '@app/services';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController extends RestController {
  constructor(
    private service: GroupsService,
    private balancesService: BalancesService,
    private transactionsService: TransactionsService,
  ) {
    super();
  }

  @Get('my-groups')
  async myGroups(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const groups = await this.service.getMyGroups(req.user as UserModel);
    return res.success(groups);
  }

  @Validate(GroupDetailsByIdDto)
  @Get(':groupId')
  async getGroupDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: GroupDetailsByIdDto,
  ): Promise<Response> {
    const group = await this.service.getGroupDetails(
      inputs,
      req.user as UserModel,
    );
    return res.success(group);
  }

  @Validate(GetGroupTransactionsDto)
  @Get(':groupId/transactions')
  async getGroupTransactions(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: GetGroupTransactionsDto,
  ): Promise<Response> {
    const transactions =
      await this.transactionsService.getTransactionsByGroupId(
        inputs,
        req.user as UserModel,
      );
    return res.success(transactions);
  }

  @Validate(GetGroupBalancesDto)
  @Get(':groupId/balances')
  async getGroupBalances(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: GetGroupBalancesDto,
  ): Promise<Response> {
    const balances = await this.balancesService.getBalancesByGroupId(
      inputs,
      req.user as UserModel,
    );
    return res.success(balances);
  }

  @Validate(CreateGroupDto)
  @Post()
  async createGroup(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: CreateGroupDto,
  ): Promise<Response> {
    const message = await this.service.create(inputs, req.user as UserModel);
    return res.success({ message });
  }

  @Validate(AddGroupMembersDto)
  @Post(':groupId/add-members')
  async addMembers(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: AddGroupMembersDto,
  ): Promise<Response> {
    const message = await this.service.addMembers(
      inputs,
      req.user as UserModel,
    );
    return res.success({ message });
  }

  @Validate(RemoveGroupMemberDto)
  @Post(':groupId/remove-member')
  async removeMember(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: RemoveGroupMemberDto,
  ): Promise<Response> {
    const message = await this.service.removeMember(
      inputs,
      req.user as UserModel,
    );
    return res.success({ message });
  }
}
