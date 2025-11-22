import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn: '60s' },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        AuthGuard,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AuthModule {}
