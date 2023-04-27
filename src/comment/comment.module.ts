import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Video])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
