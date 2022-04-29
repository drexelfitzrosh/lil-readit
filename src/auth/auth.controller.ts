import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto, AuthSignInDto } from 'src/dto/auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthSignInDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }
}
