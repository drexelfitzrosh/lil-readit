import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

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
