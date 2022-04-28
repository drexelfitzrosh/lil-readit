import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from 'src/dto/auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthLoginDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
