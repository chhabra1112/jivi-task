import { Repositories, UserStatusEnum } from '@app/constants';
import { UserRepositoryContract } from '@app/repositories/user/contract';
import { CryptoUtil } from '@libs/boat';
import { generateUlid } from '@libs/boat/utils/helpers';
import { Inject, Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';

@Injectable()
@Command('create:user')
export class CreateUserCommand {
  constructor(
    @Inject(Repositories.USER_REPO)
    private repo: UserRepositoryContract,
  ) {}

  async handle(_cli: ConsoleIO): Promise<void> {
    const email = await _cli.ask(
      'Please enter email address',
      'admin@example.com',
    );
    const password = await _cli.password('Please enter password');

    const userExists = await this.repo.deleteWhere({ email });

    // if (userExists) {
    //   _cli.error('User already exists');
    //   return;
    // }

    const hashedPassword = await CryptoUtil.hash(password);

    await this.repo.create({
      id: generateUlid(),
      password: hashedPassword,
      email,
      status: UserStatusEnum.APPROVED,
    });

    _cli.success('A new suser has been created with the following credentials');
    _cli.info(`Email: ${email}`);
    _cli.info(`Password: ${password}`);
  }
}
