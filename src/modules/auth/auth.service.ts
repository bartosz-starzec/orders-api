import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly repo: AuthRepository,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string): Promise<User> {
        const user = await this.repo.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(user: User): Promise<{ access_token: string }> {
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
