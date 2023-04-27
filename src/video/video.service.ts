import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(id: string, createVideoDto: CreateVideoDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return this.videoRepository.save({ ...createVideoDto, user });
  }

  async findOne(id: string) {
    const video = this.videoRepository.findOne({
      relations: { user: { profile: true } },
      select: { user: { id: true, profile: { name: true, avatarPath: true } } },
      where: { id, isPublic: true },
    });
    if (!video) throw new NotFoundException('Video Not found');
    return video;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    return this.videoRepository.update(id, updateVideoDto);
  }

  remove(id: string) {
    return this.videoRepository.delete(id);
  }

  async getMostPopularByView() {
    return await this.videoRepository.find({
      take: 5,
      order: { views: 'DESC' },
    });
  }

  async queryBuilder(req: Request) {
    const builder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .select([
        'video',
        'user.id',
        'user.profile',
        'profile.id',
        'profile.name',
        'profile.isVerified',
        'profile.subscribersCount',
        'profile.avatarPath',
      ]);
    if (req.query.s) {
      builder.where('video.name LIKE :s AND video.isPublic=true', {
        s: `%${req.query.s}%`,
      });
    }
    const sort: any = req.query.sort;

    if (sort) {
      builder.orderBy('video.views', 'DESC');
    }

    return builder.getMany();
  }

  async byUserId(userId: string, isPrivate = false) {
    return this.videoRepository.find({
      relations: { comments: { user: { profile: true } } },
      // select: { user: { id: true, profile: { name: true, avatarPath: true } } },
      select: {
        comments: {
          id: true,
          message: true,
          user: { id: true, profile: { avatarPath: true, name: true } },
        },
      },
      where: { user: { id: userId } },
    });
  }

  async updateViews(id: string) {
    const updateVideo = await this.videoRepository.findOneBy({ id });

    if (!updateVideo) throw new NotFoundException('Video not found');

    return await this.videoRepository.update(id, {
      views: updateVideo.views + 1,
    });
  }

  async updateReactions(id: string, type: 'inc' | 'dis') {
    const updateVideo = await this.videoRepository.findOneBy({ id });

    if (!updateVideo) throw new NotFoundException('Video not found');
    if (type == 'inc') {
      return await this.videoRepository.update(id, {
        views: updateVideo.views + 1,
      });
    }
    return await this.videoRepository.update(id, {
      views: updateVideo.views - 1,
    });
  }
}
