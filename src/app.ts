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
import { TransactionsService, UserService } from './services';
import { GroupsService } from './services/groups';
import {
  BalanceRepository,
  GroupRepository,
  SettlementRepository,
  TransactionPartyRepository,
  TransactionRepository,
} from './repositories';
import { BalancesService } from './services/balances';
import { RemoveDebtTask } from './services/deleteDebt';
import { AmountSettlementTask } from './services/settleAmount';
import { CreateDebtTask } from './services/createDebt';
import { TransactionBalancesCalculation } from './services/balanceCalculation';
import { CalculationStrategy } from './strategies/balancesCalculation/constants';
import { DefaultBalanceCalculationStrategy } from './strategies/balancesCalculation/default';
import { TransactionsController } from './controllers/transactions';

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
  controllers: [
    AuthController,
    UserController,
    GroupsController,
    TransactionsController,
  ],
  providers: [
    JwtStrategy,
    AuthService,
    { provide: Repositories.USER_REPO, useClass: UserRepository },
    { provide: Repositories.GROUPS_REPO, useClass: GroupRepository },
    {
      provide: Repositories.TRANSACTIONS_REPO,
      useClass: TransactionRepository,
    },
    {
      provide: Repositories.TRANSACTION_PARTIES_REPO,
      useClass: TransactionPartyRepository,
    },
    { provide: Repositories.BALANCES_REPO, useClass: BalanceRepository },
    { provide: Repositories.SETTLEMENTS_REPO, useClass: SettlementRepository },
    {
      provide: CalculationStrategy.DEFAULT,
      useClass: DefaultBalanceCalculationStrategy,
    },
    TransactionBalancesCalculation,
    CreateUserCommand,
    UserService,
    GroupsService,
    BalancesService,
    TransactionsService,
    RemoveDebtTask,
    AmountSettlementTask,
    CreateDebtTask,
  ],
})
export class AppModule {}
