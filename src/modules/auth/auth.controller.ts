import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { Public } from './auth.guard';

class LoginResponseDto {
    access_token: string;
}

export const LoginRequestSchema = z.object({
    email: z.email(),
});

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({
        status: 201,
        description: 'Token issued',
        type: LoginResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body(new ZodValidationPipe(LoginRequestSchema)) body: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.authService.validateUser(body.email);

        return this.authService.login(user);
    }
}
