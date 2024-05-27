import { Repositories, ResponseMessages } from '@app/constants';
import { UserStatusEnum } from '@app/constants/enums';
import { UserRepositoryContract } from '@app/repositories/user/contract';
import { JwtStrategy } from '@app/strategies/auth/jwt';
import { PasswordLoginDto } from '@app/validators/auth/login';
import { SendLoginOTPDto } from '@app/validators/auth/sendLoginOTP';
import { VerifyLoginOtpDto } from '@app/validators/auth/verifyOTP';
import { CryptoUtil, ExceptionsHelper } from '@libs/boat';
import { generateUlid } from '@libs/boat/utils/helpers';
import { MathHelpers } from '@libs/boat/utils/math';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly VALID_OTP = '1111';
  constructor(
    @Inject(Repositories.USER_REPO)
    private userRepo: UserRepositoryContract,
    private authStrategy: JwtStrategy,
  ) {}

  async sendLoginOtp(_inputs: SendLoginOTPDto): Promise<string> {
    const otp = MathHelpers.random();
    // logic to implement cache to store otp to be verified later

    console.log(
      '🚀 ~ file: index.ts:32 ~ AuthApisService ~ sendLoginOtp ~ cacheOTP:',
      otp,
    );

    return ResponseMessages.MOBILE_OTP_SENT;
  }

  async verifyOtp(inputs: VerifyLoginOtpDto): Promise<{ token: string }> {
    ExceptionsHelper.throwBadRequestIf(
      inputs.otp !== this.VALID_OTP,
      ResponseMessages.INCORRECT_OTP,
    );
    let user;

    if (!inputs.email) {
      user = await this.userRepo.firstWhere(
        {
          phoneNumber: inputs.phoneNumber,
          countryCode: inputs.countryCode,
        },
        false,
      );
    } else {
      user = await this.userRepo.firstWhere(
        {
          email: inputs.email,
        },
        false,
      );
    }
    if (!user) {
      user = await this.userRepo.create({
        id: generateUlid(),
        ...(inputs.email && { email: inputs.email }),
        ...(inputs.phoneNumber && {
          phoneNumber: inputs.phoneNumber,
          countryCode: inputs.countryCode,
        }),
        status: UserStatusEnum.APPROVED,
      });
    }

    const accessToken = await this.authStrategy.sign({
      sub: user.id,
    });

    return { token: accessToken };
  }

  async doPasswordLogin(inputs: PasswordLoginDto): Promise<{ token: string }> {
    const user = await this.userRepo.firstWhere({ email: inputs.email }, false);
    ExceptionsHelper.throwIf(
      !user || (await CryptoUtil.compare(inputs.password, user.password)),
      new UnauthorizedException('Invalid Credentials'),
    );

    const accessToken = await this.authStrategy.sign({
      sub: user.id,
    });

    return { token: accessToken };
  }
}
