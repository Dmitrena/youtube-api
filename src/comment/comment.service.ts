import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {}

  async create(
    id: string,
    videoId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    const video = await this.videoRepository.findOneBy({ id: videoId });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if (!video)
      throw new HttpException('Video not found', HttpStatus.BAD_REQUEST);
    return this.commentRepository.save({ ...createCommentDto, user, video });
  }

  async byVideoId(videoId: string) {
    return this.commentRepository.find({ where: { video: { id: videoId } } });
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string) {
    return this.commentRepository.delete(id);
  }
}
