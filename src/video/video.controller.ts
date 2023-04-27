import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Request } from 'express';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post(':id')
  async create(
    @Param('id') id: string,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return this.videoService.create(id, createVideoDto);
  }

  @Get('most-popular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopularByView();
  }

  @Get('search')
  async search(@Req() req: Request) {
    return this.videoService.queryBuilder(req);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Get('private/:id')
  async findOnePrivate(@Param('id') id: string) {
    // return this.videoService.;
  }

  @Get('by-user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.videoService.byUserId(userId);
  }

  @Get('by-user-private/:userId')
  async getByUserIdPrivate(@Param('userId') userId: string) {
    return this.videoService.byUserId(userId, true);
  }

  // @Get()
  // async findAll(@Query('searchTerm') searchTerm?: string) {
  //   return this.videoService.findAll(searchTerm);
  // }

  @Patch(':id')
  async updateVideo(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videoService.update(id, updateVideoDto);
  }

  @Patch('update-views/:videoId')
  async updateViews(@Param('videoId') videoId: string) {
    return this.videoService.updateViews(videoId);
  }

  @Patch('update-likes/:videoId')
  async updateLikes(
    @Param('videoId') videoId: string,
    @Query('type') type: 'inc' | 'dis',
  ) {
    return this.videoService.updateReactions(videoId, type);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}
