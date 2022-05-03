import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PostDto, UpdatePostDto } from '../dto';
import { Pagination, UserToken } from './interface';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private post: PostService) {}
  @Get('')
  listPosts(@GetUser('id') id: UserToken, @Query() param: Pagination) {
    return this.post.listPost(id.id);
  }

  @Get(':postId')
  getPost(@Param('postId') postId: string) {
    return this.post.getPost(postId);
  }

  @Post('')
  addPost(@GetUser('id') id: UserToken, @Body() dto: PostDto) {
    return this.post.addPost(id.id, dto);
  }

  @Put(':postId')
  upodatePost(@Param('postId') postId: string, @Body() dto: UpdatePostDto) {}

  @Delete(':postId')
  deletePost(@GetUser('id') id: UserToken, @Param('postId') postId: string) {}
}
