import { Request, Response, RestController } from '@libs/boat';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { UserDetailTransformer } from '@app/transformer';
import { AuthGuard } from '@app/guards/auth';
import { UserModel } from '@app/models';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController extends RestController {
  constructor(private service: UserService) {
    super();
  }

  @Get('profile')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    console.log(req.user);
    return res.success(
      await this.transform(req.user, new UserDetailTransformer(), { req }),
    );
  }

  @Get('contacts')
  async getContacts(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const contacts = await this.service.getContacts(req.user as UserModel);
    return res.success(
      await this.collection(contacts, new UserDetailTransformer(), { req }),
    );
  }
}
