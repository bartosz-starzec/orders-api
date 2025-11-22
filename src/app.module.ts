import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonLogger } from './common/logger/winston-logger.provider';
import { HeaderLoggingInterceptor } from './common/interceptors/header-logging.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { UsersService } from './modules/users/users.service';
import { UsersRepository } from './modules/users/repositories/users.repository';
import { OrdersService } from './modules/orders/orders.service';
import { OrdersRepository } from './modules/orders/repositories/orders.repository';
import { OrganizationsService } from './modules/organizations/organizations.service';
import { OrganizationsRepository } from './modules/organizations/repositories/organizations.repository';
import { UsersController } from './modules/users/users.controller';
import { OrganizationsController } from './modules/organizations/organizations.controller';
import { OrdersController } from './modules/orders/orders.controller';
import { HealthController } from './modules/health/health.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT ?? '3306'),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [path.join(__dirname, 'modules', '**', 'entities', '*.entity.{ts,js}')],
            synchronize: false,
            autoLoadEntities: true,
        }),
        AuthModule,
    ],
    providers: [
        UsersService,
        UsersRepository,
        OrdersService,
        OrdersRepository,
        OrganizationsService,
        OrganizationsRepository,
        {
            provide: 'WinstonLogger',
            useClass: WinstonLogger,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: HeaderLoggingInterceptor,
        },
    ],
    controllers: [UsersController, OrganizationsController, OrdersController, HealthController],
})
export class AppModule {}
