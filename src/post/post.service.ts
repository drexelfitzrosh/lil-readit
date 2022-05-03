import { Injectable } from '@nestjs/common';
import { PostDto, UpdatePostDto } from '../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async addPost(userId: string, body: PostDto) {
    const post = await this.prisma.post.create({
      data: {
        user_id: userId,
        ...body,
      },
    });
    return {
      item: post,
    };
  }

  async updatePost(postId: string, body: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...body,
      },
    });
    return {
      item: post,
    };
  }

  async listPost(userId: string, limit = 10, page = 1) {
    const count = await this.prisma.post.count({
      where: {
        user_id: userId,
      },
    });
    const posts = await this.prisma.post.findMany({
      where: {
        user_id: userId,
      },
    });
    return {
      items: posts,
      meta: {
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getPost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    return {
      item: post,
    };
  }
}
