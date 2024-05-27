import { Module } from '@nestjs/common';
import { EventModule } from '@squareboat/nest-events';
import { BoatModule } from '@libs/boat';
import { ConsoleModule } from '@squareboat/nest-console';
import { ObjectionModule } from '@squareboat/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalizationModule } from '@squareboat/nestjs-localization';
import { AuthController } from './controllers/auth';
import { JwtStrategy } from './strategies/auth/jwt';
import { AuthService } from './services/auth';
import { UserRepository } from './repositories/user/database';
import { Repositories } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserCommand } from './commands/createUser';
import { UserController } from './controllers';
import { GroupsController } from './controllers/groups';
import { UserService } from './services';
import { GroupsService } from './services/groups';
import { GroupRepository } from './repositories';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    LocalizationModule.register({
      path: 'resources/lang',
      fallbackLang: 'en',
    }),
    BoatModule,
    EventModule,
    ConsoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('auth'),
    }),
  ],
  controllers: [AuthController, UserController, GroupsController],
  providers: [
    JwtStrategy,
    AuthService,
    { provide: Repositories.USER_REPO, useClass: UserRepository },
    { provide: Repositories.GROUPS_REPO, useClass: GroupRepository },
    CreateUserCommand,
    UserService,
    GroupsService,
  ],
})
export class AppModule {}
