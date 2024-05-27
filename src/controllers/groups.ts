import { Request, Response, RestController } from '@libs/boat';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController extends RestController {
  constructor(private service: GroupsService) {
    super();
  }

  @Get('my-groups')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
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
    const groups = await this.service.getGroupDetails(
      inputs,
      req.user as UserModel,
    );
    return res.success(groups);
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
