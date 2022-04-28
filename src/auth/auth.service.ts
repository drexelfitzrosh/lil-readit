import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthLoginDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {
    return { msg: 'login' };
  }
  async signup(dto: AuthLoginDto) {
    const hashPassword = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashPassword,
          first_name: dto.firstName,
          last_name: dto.lastName,
        },
      });

      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('email already taken');
        }
        throw error;
      }
    }
  }
}
