import { Request, Response, RestController } from '@libs/boat';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserService } from '../services';
import { UserDetailTransformer } from '@app/transformer';

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
    return res.success(
      await this.transform(req.user, new UserDetailTransformer(), { req }),
    );
  }
}
