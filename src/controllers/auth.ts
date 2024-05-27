import { Request, Response, RestController } from '@libs/boat';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '@app/services/auth';
import { PasswordLoginDto } from '@app/validators/auth/login';
import { Dto, Validate } from '@libs/boat/validator';
import { SendLoginOTPDto } from '@app/validators/auth/sendLoginOTP';
import { VerifyLoginOtpDto } from '@app/validators/auth/verifyOTP';

@Controller('auth')
export class AuthController extends RestController {
  constructor(private service: AuthService) {
    super();
  }

  @Validate(PasswordLoginDto)
  @Post('password-login')
  async passwordLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: PasswordLoginDto,
  ): Promise<Response> {
    const tokenObj = await this.service.doPasswordLogin(inputs);
    return res.success(tokenObj);
  }

  @Validate(SendLoginOTPDto)
  @Post('send-otp')
  async sendOTP(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: SendLoginOTPDto,
  ): Promise<Response> {
    const message = await this.service.sendLoginOtp(inputs);
    return res.success({ message });
  }

  @Validate(VerifyLoginOtpDto)
  @Post('verify-otp')
  async verifyOTP(
    @Req() req: Request,
    @Res() res: Response,
    @Dto() inputs: VerifyLoginOtpDto,
  ): Promise<Response> {
    const tokenObj = await this.service.verifyOtp(inputs);
    return res.success(tokenObj);
  }
}
