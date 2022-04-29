import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}
  @Get('me')
  async getUser(@GetUser() user) {
    const res = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    delete res.password;
    return res;
  }
}
